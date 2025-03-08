function calcularInss() {
    // Faixas e alíquotas de INSS

    var inssFaixa1 = 1518
    var inssFaixa2A = inssFaixa1 + 0.01
    var inssFaixa2B = 2793.88
    var inssFaixa3A = inssFaixa2B + 0.01
    var inssFaixa3B = 4190.83
    var inssFaixa4A = inssFaixa3B + 0.01
    var inssFaixa4B = 8157.41

    var aliqFaixa1 = 0.075
    var aliqFaixa2 = 0.09
    var aliqFaixa3 = 0.12
    var aliqFaixa4 = 0.14

    
    var inssTeto = 951.63;

    //-----------------------//

    var inValor = document.getElementById("inValor");
    var outCalculo = document.getElementById("outValorInss");
    
    // Converte o valor de entrada para número
    var valor = Number(inValor.value);
    

    //Forçar usuário a digitar um valor número válido
    if (isNaN(valor) || valor == "" || valor <= 0) {
        alert("Digite um valor válido para calcular o INSS.");
        inValor.focus();
        inValor.value = "";
        return;
    }

    var inss = 0;
    
    // Faixa de contribuição do INSS
    if (valor > 0 && valor <= inssFaixa1) {
        inss = valor * aliqFaixa1;
        outValorInss.textContent = "INSS: R$ " + inss.toFixed(2);
    } else if (valor > inssFaixa1 && valor <= inssFaixa2B) {
        inss = ((valor - inssFaixa1) * aliqFaixa2) + (inssFaixa1 * aliqFaixa1);
        outValorInss.textContent = "INSS: R$ " + inss.toFixed(2);
    } else if (valor > inssFaixa2B && valor <= inssFaixa3B) {
        inss = (inssFaixa1 * aliqFaixa1) + ((inssFaixa2B - inssFaixa1) * aliqFaixa2) + ((valor - inssFaixa2B) * aliqFaixa3);
        outValorInss.textContent = "INSS: R$ " + inss.toFixed(2);
    } else if (valor > inssFaixa3B && valor <= inssFaixa4B) {
        inss = (inssFaixa1 * aliqFaixa1) + ((inssFaixa2B - inssFaixa1) * aliqFaixa2) + ((inssFaixa3B - inssFaixa2B) * aliqFaixa3) + ((valor - inssFaixa3B) * aliqFaixa4);
        outValorInss.textContent = "INSS: R$ " + inss.toFixed(2);
    } else if (valor > inssFaixa4B) {
        inss = inssTeto;
        outValorInss.textContent = "INSS: R$ " + inssTeto + " (teto máximo)";
    }

    //retorna valor do INSS para a função de cálculo de impostos.
    return inss;
}

function calcularIrrf() {
    var outValorIr = document.getElementById("outValorIr");
    var inValor = document.getElementById("inValor");
    var valorIr = parseFloat(inValor.value);  // Obtém o valor do salário para cálculo do IRRF
    let inss = calcularInss(); //Number(document.getElementById("outCalculo").textContent.replace("INSS: R$ ", "").replace(" (teto máximo)", "")); // Pega o INSS calculado
    var outDescIr = document.getElementById("outDescIr");
    var valorLiq = document.getElementById("valorLiq");
    var outValorLiq = document.getElementById("outValorLiq");
    var inDependente = document.getElementById("inDependente");

    // Faixas e Alíquotas de IRRF.

    var tabelaIrFaixa0 = 2259.60;
    var tabelaIrFaixa1 = 2826.65;
    var tabelaIrFaixa2 = 3751.05; 
    var tabelaIrFaixa3 = 4664.68;
    
    var irrf = 0;
    var faixaUmIr = 169.44;
    var faixaDoisIr = 381.44;
    var faixaTresIr = 662.77;
    var faixaQuatroIr = 896.00;

    var dependente = parseInt(inDependente.value) * 189.59;

    var deducao = 0;
    if ((inss + dependente) < 564.80){
        deducao = 564.80;
    }else {
        deducao = (inss + dependente);
    }

    var novoValor = valorIr - deducao;

    if (novoValor < tabelaIrFaixa0) {
        outValorIr.textContent = "Você não tem valor suficiente para cálculo de IR.";
        valorLiq = valorIr - inss - irrf;
        outValorLiq.textContent = "Sua remuneração líquida é: R$ " + valorLiq.toFixed(2);
    } else if (novoValor >= tabelaIrFaixa0 + 0.01 && novoValor <= tabelaIrFaixa1) {
        irrf = ((valorIr - deducao) * 0.075) - faixaUmIr;
        if (irrf < 0){
            outValorIr.textContent = "Você não tem desconto de IRRF";
            valorLiq = valorIr - inss - irrf;
            outValorLiq.textContent = "Sua remuneração líquida é: R$ " + valorLiq.toFixed(2);
        } else {
            outValorIr.textContent = "IRRF: R$ " + irrf.toFixed(2) + "\n e foi utilizado o desconto: R$ " + deducao.toFixed(2);
            valorLiq = valorIr - inss - irrf;
            outValorLiq.textContent = "Sua remuneração líquida é: R$ " + valorLiq.toFixed(2);
        }
    } else if (novoValor >= tabelaIrFaixa1 + 0.01 && novoValor <= tabelaIrFaixa2) {
        irrf = ((valorIr - deducao) * 0.15) - faixaDoisIr;
        if (irrf < 0){
            outValorIr.textContent = "Você não tem desconto de IRRF";
            valorLiq = valorIr - inss - irrf;
            outValorLiq.textContent = "Sua remuneração líquida é: R$ " + valorLiq.toFixed(2);
        } else {
            outValorIr.textContent = "IRRF: R$ " + irrf.toFixed(2) + "\n e foi utilizado o desconto: R$ " + deducao.toFixed(2);
            valorLiq = valorIr - inss - irrf;
            outValorLiq.textContent = "Sua remuneração líquida é: R$ " + valorLiq.toFixed(2);
        }
    } else if (novoValor >= tabelaIrFaixa2 + 0.01 && novoValor <= tabelaIrFaixa3) {
        irrf = ((valorIr - deducao) * 0.225) - faixaTresIr;
        outValorIr.textContent = "IRRF: R$ " + irrf.toFixed(2)+ "\n e foi utilizado o desconto: R$ " + deducao.toFixed(2);
        valorLiq = valorIr - inss - irrf;
        outValorLiq.textContent = "Sua remuneração líquida é: R$ " + valorLiq.toFixed(2);
    } else if (novoValor >= tabelaIrFaixa3 + 0.01) {
        irrf = ((valorIr - deducao) * 0.275) - faixaQuatroIr;
        outValorIr.textContent = "IRRF: R$ " + irrf.toFixed(2)+ "\n e foi utilizado o desconto: R$ " + deducao.toFixed(2);
        valorLiq = valorIr - inss - irrf;
        outValorLiq.textContent = "Sua remuneração líquida é: R$ " + valorLiq.toFixed(2);
    }

    //Retorna valor do IRRF para a função cálculo de impostos.
    return irrf;
}

function calcularFgts(){
    var inValor = document.getElementById("inValor");
    var outFgts = document.getElementById("outFgts");

    var remuneracao = Number(inValor.value);

    if (isNaN(remuneracao) || inValor == "" || remuneracao <= 0) {
        inValor.focus();
        return;
    }

    var fgts = remuneracao * 0.08;

    outFgts.textContent = "O valor do seu FGTS é de: R$ " + fgts.toFixed(2);

    //retorna valor do FGTS para a função de cálculo de impostos.
    return fgts;
}

function calcularImpostos(){
    calcularInss();
    calcularIrrf();
    calcularFgts();
}

var btCalcularImpostos = document.getElementById("btCalcularImpostos");
btCalcularImpostos.addEventListener("click", calcularImpostos);