// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os elementos que devem ter o efeito de piscar
    const neonItems = document.querySelectorAll('.neon-item');

    // Função que faz um elemento piscar
    function flickerElement(element) {
        // Adiciona a classe que remove o brilho
        element.classList.add('flicker');

        // Define uma duração muito curta para o "apagado"
        const flickerDuration = Math.random()  * 180 + 40; // Entre 20ms e 100ms

        // Remove a classe após a duração para que o brilho volte
        setTimeout(() => {
            element.classList.remove('flicker');
        }, flickerDuration);
    }

    // Função que escolhe aleatoriamente qual elemento piscar e quando
    function randomFlickerLoop() {
        // Escolhe um índice aleatório
        const randomIndex = Math.floor(Math.random() * neonItems.length);
        const elementToFlicker = neonItems[randomIndex];

        // Faz o elemento piscar
        flickerElement(elementToFlicker);

        // Define o tempo até a próxima piscada (aleatório)
        const timeToNextFlicker = Math.random() * 2000 + 900; // Entre 1 e 3 segundos

        // Chama a função novamente após o tempo definido
        setTimeout(randomFlickerLoop, timeToNextFlicker);
    }

    // Inicia o ciclo de piscadas aleatórias
    if (neonItems.length > 0) {
        randomFlickerLoop();
    }

    const toggleButtons = document.querySelectorAll(".toggle-info");

        toggleButtons.forEach(button => {

            button.addEventListener("click", () => {

                const extraInfo = button.nextElementSibling;

                extraInfo.classList.toggle("active");

                if(extraInfo.classList.contains("active")){

                button.innerHTML = "▲ Fechar";

                button.style.boxShadow =
                    "0 0 20px rgba(255,106,0,.5)";

                }else{

                button.innerHTML = "▼ Ver mais";

                button.style.boxShadow = "none";
                }

            });

        });
});
// EFEITO HEADER
window.addEventListener("scroll", () => {

  const header = document.querySelector("header");

  if(window.scrollY > 50){
    header.style.boxShadow = "0 0 20px rgba(0,255,255,.3)";
  }else{
    header.style.boxShadow = "none";
  }

});
