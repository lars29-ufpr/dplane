// js/math-engine.js

/**
 * Compila a string da fórmula em uma função JavaScript nativa de altíssima performance.
 * @param {string} formulaStr - Ex: "p.r * x * (1 - x)"
 * @returns {Function} Função que recebe (x, p) onde p é o objeto de parâmetros
 */
export function compile1DFunction(formulaStr) {
    try {
        return new Function('x', 'p', `return ${formulaStr};`);
    } catch (e) {
        console.error("Erro ao compilar função:", e);
        return () => 0; // Fallback seguro
    }
}

/**
 * Calcula o Expoente de Lyapunov (λ_L) para classificar o regime dinâmico.
 * λ_L < 0 (estável), λ_L = 0 (bifurcação), λ_L > 0 (caos).
 */
export function calculateLyapunov(f, x0, p, transient = 200, iterations = 800) {
    let x = x0;
    const eps = 1e-7;

    // 1. Escoa o transiente para a órbita cair no atrator
    for (let i = 0; i < transient; i++) {
        x = f(x, p);
        if (!isFinite(x) || Math.abs(x) > 1e6) return NaN; // Divergiu
    }

    // 2. Soma os logaritmos das derivadas ao longo da órbita
    let sumLn = 0;
    for (let i = 0; i < iterations; i++) {
        // Derivada numérica por diferenças centrais
        const df = (f(x + eps, p) - f(x - eps, p)) / (2 * eps);
        const absDf = Math.abs(df);
        
        // Evita -Infinity em ciclos superestáveis (derivada exata = 0)
        sumLn += Math.log(absDf < 1e-12 ? 1e-12 : absDf);
        
        x = f(x, p);
        if (!isFinite(x) || Math.abs(x) > 1e6) return NaN;
    }

    return sumLn / iterations;
}

/**
 * Encontra pontos fixos f(x) = x no intervalo visível e classifica a estabilidade.
 */
export function findFixedPoints(f, p, xMin, xMax, subintervals = 200) {
    const g = (x) => f(x, p) - x;
    const dx = (xMax - xMin) / subintervals;
    const points = [];
    const eps = 1e-7;

    for (let i = 0; i < subintervals; i++) {
        let a = xMin + i * dx;
        let b = a + dx;
        let ga = g(a);
        let gb = g(b);

        // Se houver troca de sinal, há uma raiz neste subintervalo
        if (isFinite(ga) && isFinite(gb) && ga * gb <= 0) {
            
            // Método da Bisseção para refinamento da raiz
            let root = a;
            for (let k = 0; k < 30; k++) {
                root = 0.5 * (a + b);
                let groot = g(root);
                if (Math.abs(groot) < 1e-9) break;
                if (ga * groot <= 0) {
                    b = root;
                    gb = groot;
                } else {
                    a = root;
                    ga = groot;
                }
            }

            // Teste de estabilidade via derivada no ponto fixo
            const df = (f(root + eps, p) - f(root - eps, p)) / (2 * eps);
            const absDf = Math.abs(df);

            let type = "estavel";
            let color = "#10b981"; // Verde
            
            if (Math.abs(absDf - 1) < 0.01) {
                type = "neutro";
                color = "#f59e0b"; // Amarelo
            } else if (absDf > 1) {
                type = "instavel";
                color = "#ef4444"; // Vermelho
            }

            // Evita duplicatas se a bisseção de intervalos adjacentes convergir para a mesma raiz
            const alreadyExists = points.some(pt => Math.abs(pt.x - root) < 1e-5);
            
            if (!alreadyExists) {
                points.push({
                    x: root,
                    derivative: df,
                    type: type,
                    color: color,
                    mode: df < 0 ? "oscilatorio" : "monotono"
                });
            }
        }
    }
    return points;
}
