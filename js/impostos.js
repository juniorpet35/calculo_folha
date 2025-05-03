document.addEventListener("DOMContentLoaded", function () {
    const inputDataReferencia = document.getElementById("dataReferencia");

    if (inputDataReferencia) {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');

        inputDataReferencia.value = `${ano}-${mes}-${dia}`;
    }
});


function dataReferencia() {
    const inputDataReferencia = document.getElementById("dataReferencia");
    const outErro = document.querySelector(".outErro");

    // Verifica se o elemento existe
    if (!inputDataReferencia) {
        console.error("Elemento 'dataReferencia' não encontrado.");
        return null;
    }

    // Captura o valor do input diretamente (sem ajustes)
    const dataSelecionada = new Date(inputDataReferencia.value);

    // Valida se a data é válida
    if (isNaN(dataSelecionada.getTime())) {
        outErro.textContent = "Por favor, selecione uma data válida.";
        return null;
    }

    outErro.textContent = ""; // Limpa a mensagem de erro anterior

    // Retorna apenas a parte de data (sem horas)
    return dataSelecionada.toISOString().split("T")[0]; // Formato YYYY-MM-DD
}

function calcularInss() {

    const inssFev2025 = [1518, 2793.88, 4190.83, 8157.41];
    const faixaInssFev2025 = [0.075, 0.09, 0.12, 0.14];
    const deducaoInssFev2025 = [0.00, 22.77, 106.60, 190.42];
    
    let inssTeto = 951.63;

    //-----------------------//

    let inValor = document.getElementById("inValor");
    let outInss = document.getElementById("outInss");
    
    // Converte o valor de entrada para número
    let valor = Number(inValor.value);
    

    //Forçar usuário a digitar um valor numérico válido
    if (isNaN(valor) || valor == "" || valor <= 0) {
        const erroRemuneracao = document.getElementById("erroRemuneracao");
        erroRemuneracao.textContent = "Digite um valor válido para calcular a sua remuneração.";
        inValor.focus();
        inValor.value = "";
        return;
    } else {
        erroRemuneracao.textContent = "";
    }

    //let valor = Number(inRemuneracao.value);
    let valorInss = 0;

    if (valor <= inssFev2025[0]){
        valorInss += (valor * faixaInssFev2025[0]);
        outInss.textContent = " INSS: R$ " + valorInss.toFixed(2);
    } else if(valor > inssFev2025[0] && valor <= inssFev2025[1]){
        valorInss += (valor * faixaInssFev2025[1] - deducaoInssFev2025[1]);
        outInss.textContent = " INSS: R$ " + valorInss.toFixed(2);
    }else if(valor > inssFev2025[1] && valor <= inssFev2025[2]){
        valorInss += (valor * faixaInssFev2025[2] - deducaoInssFev2025[2]);
        outInss.textContent = " INSS: R$ " + valorInss.toFixed(2);
    } else if(valor > inssFev2025[2] && valor <= inssFev2025[3]){
        valorInss += (valor * faixaInssFev2025[3] - deducaoInssFev2025[3]);
        outInss.textContent = " INSS: R$ " + valorInss.toFixed(2);
    } else if (valor > inssFev2025[3]){
        valorInss+= 951.62
        outInss.textContent = " INSS: R$ " + valorInss.toFixed(2);
    }

    //retorna valor do INSS para a função de cálculo de impostos.
    return valorInss;
}

function irrf2024() {

    const irrfFev2024 = [2259.60, 2826.65, 3751.05, 4664.68];
    const faixaIrrfFev2024 = [0.075, 0.15, 0.225, 0.275];
    const deducaoIrrfFev2024 = [169.44, 381.44, 662.77, 896.00];

    let inss = calcularInss();
    let outErro = document.querySelector(".outErro");

    let outValorIr = document.getElementById("outValorIr");
    let inValor = document.getElementById("inValor");
    let valorIr = parseFloat(inValor.value);  // Obtém o valor do salário para cálculo do IRRF

    let valorLiq = document.getElementById("valorLiq");
    let outValorLiq = document.getElementById("outValorLiq");
    let inDependente = document.getElementById("inDependente");
    let outValorInss = document.getElementById("outValorInss");

    let qtDependente = inDependente.value;
    let vlDependente = qtDependente * 189.59;

    let deducao = 0;
    if ((inss + vlDependente) < 564.80){
        deducao = 564.80;
    }else {
        deducao = (inss + vlDependente);
    }

    if (inDependente.value < 0 || inDependente.value > 10){
        outErro.textContent = ("A quantidade de dependentes não pode ser negativa ou maior que 10!");
        inDependente.value = 0;
        inValor.value = "";
        inDependente.focus();
        outValorInss.textContent = "";
        outValorIr.textContent = "";
        outFgts.textContent = "";
        outValorLiq.textContent = "";
        return;
    } /*else {
        qtDependente = inDependente.value;
    }*/

    let base = (inValor.value - deducao);
    let irrfValor = 0;

    if(base <= irrfFev2024[0]){
        outValorIr.textContent = "Sem desconto de IRRF";
    } else if(base > irrfFev2024[0] && base <= irrfFev2024[1]){
        irrfValor = (base * faixaIrrfFev2024[0]) - deducaoIrrfFev2024[0];
        outValorIr.textContent = "IRRF: R$ " + irrfValor.toFixed(2) + "\n e foi utilizado o desconto: R$ " + deducao.toFixed(2);;
    } else if(base >= irrfFev2024[1] && base <= irrfFev2024[2]){
        irrfValor = (base * faixaIrrfFev2024[1]) - deducaoIrrfFev2024[1];
        outValorIr.textContent = "IRRF: R$ " + irrfValor.toFixed(2) + "\n e foi utilizado o desconto: R$ " + deducao.toFixed(2);;
    } else if(base > irrfFev2024[2] && base <= irrfFev2024[3]){
        irrfValor = (base * faixaIrrfFev2024[2]) - deducaoIrrfFev2024[2];
        outValorIr.textContent = "IRRF: R$ " + irrfValor.toFixed(2) + "\n e foi utilizado o desconto: R$ " + deducao.toFixed(2);;
    } else if(base > irrfFev2024[3]){
        irrfValor = (base * faixaIrrfFev2024[3]) - deducaoIrrfFev2024[3];
        outValorIr.textContent = "IRRF: R$ " + irrfValor.toFixed(2) + "\n e foi utilizado o desconto: R$ " + deducao.toFixed(2);;
    }

    //Retorna valor do IRRF para a função cálculo de impostos.
    return irrfValor;
    }

function irrf2025() {
    
        const irrfMaio2025 = [2428.80, 2826.65, 3751.05, 4664.68];
        const faixaIrrfMaio2025 = [0.075, 0.15, 0.225, 0.275];
        const deducaoIrrfMaio2025 = [182.16, 394.16, 675.49, 908.73];
    
        let inss = calcularInss();
        let outErro = document.querySelector(".outErro");
    
        let outValorIr = document.getElementById("outValorIr");
        let inValor = document.getElementById("inValor");
        //let valorIr = parseFloat(inValor.value);  // Obtém o valor do salário para cálculo do IRRF
    
        //let valorLiq = document.getElementById("valorLiq");
        let outValorLiq = document.getElementById("outValorLiq");
        let inDependente = document.getElementById("inDependente");
        let outValorInss = document.getElementById("outValorInss");
    
        let qtDependente = inDependente.value;
        let vlDependente = qtDependente * 189.59;
    
        let deducao = 0;
        if ((inss + vlDependente) < 607.20){
            deducao = 607.20;
        }else {
            deducao = (inss + vlDependente);
        }
    
        if (inDependente.value < 0 || inDependente.value > 10){
            outErro.textContent = ("A quantidade de dependentes não pode ser negativa ou maior que 10!");
            inDependente.value = 0;
            inValor.value = "";
            inDependente.focus();
            outValorInss.textContent = "";
            outValorIr.textContent = "";
            outFgts.textContent = "";
            outValorLiq.textContent = "";
            return;
        } /*else {
            qtDependente = inDependente.value;
        }*/
    
        let base = (inValor.value - deducao);
        let irrfValor = 0;
    
        if(base <= irrfMaio2025[0]){
            outValorIr.textContent = "Sem desconto de IRRF";
        } else if(base > irrfMaio2025[0] && base <= irrfMaio2025[1]){
            irrfValor = (base * faixaIrrfMaio2025[0]) - deducaoIrrfMaio2025[0];
            outValorIr.textContent = "IRRF: R$ " + irrfValor.toFixed(2) + "\n e foi utilizado o desconto: R$ " + deducao.toFixed(2);;
        } else if(base >= irrfMaio2025[1] && base <= irrfMaio2025[2]){
            irrfValor = (base * faixaIrrfMaio2025[1]) - deducaoIrrfMaio2025[1];
            outValorIr.textContent = "IRRF: R$ " + irrfValor.toFixed(2) + "\n e foi utilizado o desconto: R$ " + deducao.toFixed(2);;
        } else if(base > irrfMaio2025[2] && base <= irrfMaio2025[3]){
            irrfValor = (base * faixaIrrfMaio2025[2]) - deducaoIrrfMaio2025[2];
            outValorIr.textContent = "IRRF: R$ " + irrfValor.toFixed(2) + "\n e foi utilizado o desconto: R$ " + deducao.toFixed(2);;
        } else if(base > irrfMaio2025[3]){
            irrfValor = (base * faixaIrrfMaio2025[3]) - deducaoIrrfMaio2025[3];
            outValorIr.textContent = "IRRF: R$ " + irrfValor.toFixed(2) + "\n e foi utilizado o desconto: R$ " + deducao.toFixed(2);;
        }
    
        //Retorna valor do IRRF para a função cálculo de impostos.
        return irrfValor;
    }

function irrf() {
        const data = dataReferencia(); // Captura a data selecionada
        const outValorIr = document.getElementById("outValorIr"); // Elemento para exibir resultado
    
        // Verifica se a data foi retornada corretamente
        if (!data) {
            console.error("Data inválida ou não selecionada.");
            return;
        }
    
        const dataCorte = "2025-04-30"; // Define a data limite como string no formato "YYYY-MM-DD"
        let irrfValor = 0;
    
        // Compara a data capturada com a data limite
        if (data <= dataCorte) {
            irrfValor = irrf2024(); // Usa a tabela de 2024
        } else {
            irrfValor = irrf2025(); // Usa a tabela de 2025
        }
    
        // Exibe o valor calculado no campo de saída
        if (outValorIr) {
            outValorIr.textContent = "IRRF: R$ " + irrfValor.toFixed(2);
        } else {
            console.error("Elemento 'outValorIr' não encontrado na DOM.");
        }

        return irrfValor;
    }

function calcularFgts(){
    let inValor = document.getElementById("inValor");
    let outFgts = document.getElementById("outFgts");

    let remuneracao = Number(inValor.value);

    if (isNaN(remuneracao) || inValor == "" || remuneracao <= 0) {
        inValor.focus();
        return;
    }

    let fgts = remuneracao * 0.08;

    outFgts.textContent = "FGTS: R$ " + fgts.toFixed(2);

    //retorna valor do FGTS para a função de cálculo de impostos.
    return fgts;
}
function valorLiq(){
    let irrfValor = irrf();
    let inss = calcularInss();
    let inValor = document.getElementById("inValor");
    let outValorLiq = document.getElementById("outValorLiq");
    let valor = Number(inValor.value);
    let valorLiquido = valor - irrfValor - inss;

    outValorLiq.textContent = "Remuneração Líquida: " + valorLiquido.toFixed(2);

    return valorLiquido;
}

function calcularImpostos() {
    // Valida a data antes de continuar
    const referencia = dataReferencia();
    if (!referencia) {
        return; // Interrompe caso a data seja inválida
    }

    // Executa os cálculos
    calcularInss();
    irrf();
    calcularFgts();
    valorLiq();

    // Limpa os campos de entrada para nova utilização
    inValor.value = "";
    inDependente.value = "";
    inValor.focus();
}

const btCalcularImpostos = document.getElementById("btCalcularImpostos");
btCalcularImpostos.addEventListener("click", calcularImpostos);