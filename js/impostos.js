document.addEventListener("DOMContentLoaded", function () {
    const inputDataReferencia = document.getElementById("dataReferencia");
    const inputValor = document.getElementById("inValor");
    const inputDependente = document.getElementById("inDependente");
    const btCalcularImpostos = document.getElementById("btCalcularImpostos");
    const outInss = document.getElementById("outInss");
    const outValorIr = document.getElementById("outValorIr");
    const outFgts = document.getElementById("outFgts");
    const outValorLiq = document.getElementById("outValorLiq");
    const erroRemuneracao = document.getElementById("erroRemuneracao");
    const outErro = document.querySelector(".outErro");

    let dadosInss = null;
    let dadosIrrf = null;

    async function carregarDados() {
        try {
            btCalcularImpostos.disabled = true;
            outErro.textContent = "Carregando dados das tabelas...";

            const [respostaInss, respostaIrrf] = await Promise.all([
                fetch('dados/tabela_inss.json'),
                fetch('dados/tabela_irrf.json')
            ]);

            if (!respostaInss.ok || !respostaIrrf.ok) {
                throw new Error('Falha ao carregar um ou mais arquivos de dados.');
            }

            const [jsonInss, jsonIrrf] = await Promise.all([
                respostaInss.json(),
                respostaIrrf.json()
            ]);

            dadosInss = jsonInss;
            dadosIrrf = jsonIrrf;

            console.log("Dados de INSS e IRRF carregados com sucesso!");

            btCalcularImpostos.disabled = false;
            outErro.textContent = "";

        } catch (error) {
            console.error("Erro fatal ao carregar dados:", error);
            outErro.textContent = "Não foi possível carregar as tabelas. Verifique a estrutura de pastas e se está usando um servidor local.";
        }
    }

    function encontrarTabelaPorData(tabelas, dataCalculo) {
        const data = new Date(dataCalculo + 'T12:00:00Z');
        for (const tabela of tabelas) {
            const vigencia = tabela.vigencia;
            if (vigencia.startsWith('A partir de')) {
                const [dia, mes, ano] = vigencia.replace('A partir de ', '').split('/');
                const inicioVigencia = new Date(`${ano}-${mes}-${dia}T12:00:00Z`);
                if (data >= inicioVigencia) return tabela;
            } else if (vigencia.startsWith('De ')) {
                const partes = vigencia.replace('De ', '').split(' a ');
                const [diaInicio, mesInicio, anoInicio] = partes[0].split('/');
                const [diaFim, mesFim, anoFim] = partes[1].split('/');
                const inicioVigencia = new Date(`${anoInicio}-${mesInicio}-${diaInicio}T12:00:00Z`);
                const fimVigencia = new Date(`${anoFim}-${mesFim}-${diaFim}T12:00:00Z`);
                if (data >= inicioVigencia && data <= fimVigencia) return tabela;
            }
        }
        return null;
    }

    function calcularINSS(salarioBruto, tabelaInss) {
        if (!tabelaInss) return 0;
        let inssCalculado = 0;
        const salarioBase = Math.min(salarioBruto, tabelaInss.teto_salarial);
        let salarioRestante = salarioBase;
        let baseFaixaAnterior = 0;
        for (const faixa of tabelaInss.faixas) {
            if (salarioRestante <= 0) break;
            const limiteFaixa = faixa.salario_ate - baseFaixaAnterior;
            const valorNaFaixa = Math.min(salarioRestante, limiteFaixa);
            inssCalculado += valorNaFaixa * (faixa.aliquota / 100);
            salarioRestante -= valorNaFaixa;
            baseFaixaAnterior = faixa.salario_ate;
        }
        return parseFloat(inssCalculado.toFixed(2));
    }

    function calcularIRRF(salarioBruto, valorInss, numDependentes, tabelaIrrf) {
        if (!tabelaIrrf) return { valor: 0, baseCalculo: 0, usouSimplificado: false };
        const deducaoDependentes = numDependentes * tabelaIrrf.deducao_por_dependente;
        let baseCalculoFinal, usouSimplificado = false;
        const baseCalculoPadrao = salarioBruto - valorInss - deducaoDependentes;
        const deducaoSimplificada = parseFloat(tabelaIrrf.deducao_simplificada);
        if (deducaoSimplificada > 0) {
            const baseCalculoSimplificada = salarioBruto - deducaoSimplificada;
            if (baseCalculoSimplificada < baseCalculoPadrao) {
                baseCalculoFinal = baseCalculoSimplificada;
                usouSimplificado = true;
            } else {
                baseCalculoFinal = baseCalculoPadrao;
            }
        } else {
            baseCalculoFinal = baseCalculoPadrao;
        }
        if (baseCalculoFinal < 0) baseCalculoFinal = 0;
        let irrfValor = 0;
        for (const faixa of tabelaIrrf.faixas) {
            if (faixa.base_calculo_ate === 'acima' || baseCalculoFinal <= faixa.base_calculo_ate) {
                irrfValor = (baseCalculoFinal * (faixa.aliquota / 100)) - faixa.parcela_a_deduzir;
                break;
            }
        }
        return {
            valor: parseFloat(Math.max(0, irrfValor).toFixed(2)),
            baseCalculo: parseFloat(baseCalculoFinal.toFixed(2)),
            usouSimplificado: usouSimplificado
        };
    }

    function calcularFGTS(salarioBruto) {
        return parseFloat((salarioBruto * 0.08).toFixed(2));
    }

    // --- 5. FUNÇÃO PRINCIPAL DE CONTROLE ---
    function handleCalcularImpostos() {
        erroRemuneracao.textContent = "";
        outErro.textContent = "";
        const dataReferencia = inputDataReferencia.value;
        if (!dataReferencia) {
            outErro.textContent = "Por favor, selecione uma data válida.";
            return;
        }
        const salarioBruto = parseFloat(inputValor.value);
        if (isNaN(salarioBruto) || salarioBruto <= 0) {
            erroRemuneracao.textContent = "Digite um valor válido para a remuneração.";
            inputValor.focus();
            return;
        }
        const numDependentes = parseInt(inputDependente.value) || 0;
        if (numDependentes < 0 || numDependentes > 20) {
             outErro.textContent = "O número de dependentes deve ser entre 0 e 20.";
             inputDependente.focus();
             return;
        }
        const tabelaInss = encontrarTabelaPorData(dadosInss.inss_tabelas, dataReferencia);
        const tabelaIrrf = encontrarTabelaPorData(dadosIrrf.irrf_tabelas, dataReferencia);
        if (!tabelaInss || !tabelaIrrf) {
            outErro.textContent = "Não há tabelas de cálculo para a data selecionada.";
            return;
        }
        const valorInss = calcularINSS(salarioBruto, tabelaInss);
        const { valor: valorIrrf, baseCalculo, usouSimplificado } = calcularIRRF(salarioBruto, valorInss, numDependentes, tabelaIrrf);
        const valorFgts = calcularFGTS(salarioBruto);
        const valorLiquido = salarioBruto - valorInss - valorIrrf;
        outInss.textContent = "INSS: R$ " + valorInss.toFixed(2);
        let textoIrrf = `IRRF: R$ ${valorIrrf.toFixed(2)}`;
        if (valorIrrf > 0) {
            const tipoDesconto = usouSimplificado ? "ded. simplificada" : "ded. padrão";
            textoIrrf += ` (Base: R$ ${baseCalculo.toFixed(2)}, usando ${tipoDesconto})`;
        } else {
             textoIrrf = "IRRF: Isento";
        }
        outValorIr.textContent = textoIrrf;
        outFgts.textContent = "FGTS: R$ " + valorFgts.toFixed(2);
        outValorLiq.textContent = "Remuneração Líquida: R$ " + valorLiquido.toFixed(2);
    }

    if (inputDataReferencia) {
        inputDataReferencia.value = new Date().toISOString().split('T')[0];
    }

    carregarDados();

    btCalcularImpostos.addEventListener("click", handleCalcularImpostos);
});
