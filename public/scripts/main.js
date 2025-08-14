// Variables globales
let currentQuestionIndex = 0;
let userAnswers = [];
let userDemographics = {};

// Elementos del DOM
const welcomeSection = document.getElementById('welcome');
const questionsSection = document.getElementById('questions');
const resultsSection = document.getElementById('results');

// Función para iniciar las preguntas después de completar datos demográficos
function startQuestions() {
    // Validar que todos los campos estén completados
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const department = document.getElementById('department').value;

    if (!age || !gender || !department || parseInt(age) < 18 || parseInt(age) > 120) {
        showValidationModal();
        return;
    }

    // Guardar datos demográficos
    userDemographics = { age, gender, department };

    // Inicializar respuestas del usuario
    userAnswers = new Array(window.testData.questions.length).fill(null);

    // Inicializar progress bar
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = '5%'; // Mostrar un poco de progreso inicial
        progressBar.style.display = 'block';
        progressBar.style.visibility = 'visible';
    }

    // Mostrar primera pregunta
    hideAllSections();
    questionsSection.classList.add('active');
    showQuestion(0);
}

// Función para mostrar una pregunta específica
function showQuestion(questionIndex) {
    currentQuestionIndex = questionIndex;
    const question = window.testData.questions[questionIndex];
    
    // Actualizar contenido de la pregunta
    document.getElementById('questionTitle').textContent = question.title;
    
    // Procesar el texto de la pregunta para agregar tooltips
    const processedText = processTextForTooltips(question.text);
    document.getElementById('questionText').innerHTML = processedText;
    
    document.getElementById('currentQuestion').textContent = questionIndex + 1;
    document.getElementById('totalQuestions').textContent = window.testData.questions.length;

    // Actualizar barra de progreso
    const progress = ((questionIndex + 1) / window.testData.questions.length) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = Math.max(5, progress) + '%'; // Mínimo 5% para visibilidad
        progressBar.style.display = 'block';
        progressBar.style.visibility = 'visible';
    }

    // Cambiar fondo según eje temático
    updateThematicBackground(questionIndex);

    // Limpiar selecciones anteriores
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.onclick = function() {
            selectAnswer(this, parseInt(this.dataset.value));
        };
    });

    // Mostrar respuesta previa si existe
    if (userAnswers[questionIndex] !== null) {
        const previousAnswer = userAnswers[questionIndex];
        answerButtons.forEach(btn => {
            if (parseInt(btn.dataset.value) === previousAnswer) {
                btn.classList.add('selected');
            }
        });
    }

    // Actualizar botones de navegación
    updateNavigationButtons();
}

// Función para procesar texto y agregar tooltips
function processTextForTooltips(text) {
    const { glossary } = window.testData;
    let processedText = text;
    
    Object.keys(glossary).forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        processedText = processedText.replace(regex, 
            `<span class="info-word" onclick="showTooltip('${term}')">${term}</span>`
        );
    });
    
    return processedText;
}

// Función para mostrar tooltip
function showTooltip(term) {
    console.log('Mostrando tooltip para:', term); // Debug
    const { glossary } = window.testData;
    const info = glossary[term.toLowerCase()];
    
    if (info) {
        document.getElementById('tooltipTitle').textContent = info.title;
        document.getElementById('tooltipText').textContent = info.text;
        const tooltipElement = document.getElementById('tooltip');
        if (tooltipElement) {
            tooltipElement.classList.remove('hidden');
            console.log('Tooltip mostrado correctamente'); // Debug
        } else {
            console.error('Elemento tooltip no encontrado'); // Debug
        }
    } else {
        console.error('No se encontró información para el término:', term); // Debug
    }
}

// Función para ocultar tooltip
function hideTooltip() {
    console.log('Ocultando tooltip'); // Debug
    const tooltipElement = document.getElementById('tooltip');
    if (tooltipElement) {
        tooltipElement.classList.add('hidden');
        console.log('Tooltip ocultado correctamente'); // Debug
    } else {
        console.error('Elemento tooltip no encontrado al ocultar'); // Debug
    }
}

// Función para actualizar botones de navegación
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Botón anterior
    prevBtn.disabled = currentQuestionIndex === 0;
    
    // Botón siguiente - solo habilitado si hay respuesta
    nextBtn.disabled = userAnswers[currentQuestionIndex] === null;
    
    // Cambiar texto y estilo del botón en la última pregunta
    if (currentQuestionIndex === window.testData.questions.length - 1) {
        nextBtn.innerHTML = '✓';
        nextBtn.onclick = calculateResults;
        nextBtn.classList.add('finish-btn');
    } else {
        nextBtn.innerHTML = '›';
        nextBtn.onclick = nextQuestion;
        nextBtn.classList.remove('finish-btn');
    }
}

// Función para ir a la pregunta anterior
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        showQuestion(currentQuestionIndex - 1);
    }
}

// Función para seleccionar una respuesta
function selectAnswer(button, value) {
    // Remover selección anterior
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('selected', 'selecting');
    });

    // Marcar como seleccionado con animación
    button.classList.add('selected', 'selecting');

    // Remover la clase de animación después de que termine
    setTimeout(() => {
        button.classList.remove('selecting');
    }, 400);

    // Guardar respuesta
    userAnswers[currentQuestionIndex] = value;

    // Actualizar botones de navegación
    updateNavigationButtons();

    // Avanzar automáticamente a la siguiente pregunta después de un breve delay
    setTimeout(() => {
        if (currentQuestionIndex < window.testData.questions.length - 1) {
            nextQuestion();
        } else {
            // Si es la última pregunta, mostrar resultados automáticamente
            calculateResults();
        }
    }, 600); // Delay de 600ms para que el usuario vea la selección y animación
}

// Función para avanzar a la siguiente pregunta
function nextQuestion() {
    // Verificar que hay una respuesta seleccionada
    if (userAnswers[currentQuestionIndex] === null) {
        // alert('Por favor, selecciona una respuesta antes de continuar.');
        return;
    }

    if (currentQuestionIndex < window.testData.questions.length - 1) {
        showQuestion(currentQuestionIndex + 1);
    } else {
        // Todas las preguntas respondidas, mostrar resultados
        showResults();
    }
}

// Función para calcular y mostrar resultados
function showResults() {
    // Guardar datos en localStorage para poder regresar a resultados
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    localStorage.setItem('userDemographics', JSON.stringify(userDemographics));
    
    const affinityScores = calculateAffinity();
    
    hideAllSections();
    resultsSection.classList.add('active');
    
    displayResults(affinityScores);
}

// Función para calcular afinidad con cada candidato
function calculateAffinity() {
    const { candidates, candidateScores } = window.testData;
    const affinityScores = [];

    candidates.forEach((candidate, candidateIndex) => {
        let totalDistance = 0;
        let validQuestions = 0;

        userAnswers.forEach((userAnswer, questionIndex) => {
            if (userAnswer !== null) {
                const candidateAnswer = candidateScores[candidateIndex][questionIndex];
                
                // Calcular distancia absoluta entre respuestas
                const distance = Math.abs(userAnswer - candidateAnswer);
                totalDistance += distance;
                validQuestions++;
            }
        });

        // Calcular afinidad usando la fórmula de la guía
        let affinityPercentage = 0;
        if (validQuestions > 0) {
            // Distancia máxima posible es 4 (diferencia entre -2 y +2)
            const maxPossibleDistance = validQuestions * 4;
            
            // Afinidad = 1 - (distancia_total / distancia_máxima)
            const affinity = 1 - (totalDistance / maxPossibleDistance);
            
            // Convertir a porcentaje y redondear
            affinityPercentage = Math.round(affinity * 100);
            
            // Asegurar que no sea negativo
            affinityPercentage = Math.max(0, affinityPercentage);
        }

        affinityScores.push({
            candidate: candidate,
            percentage: affinityPercentage,
            rawDistance: totalDistance,
            validQuestions: validQuestions
        });
    });

    // Ordenar por porcentaje de afinidad (mayor a menor)
    affinityScores.sort((a, b) => b.percentage - a.percentage);

    return affinityScores;
}

// Función para mostrar los resultados en la interfaz
function displayResults(affinityScores) {
    // Mostrar resultado principal (Top 1)
    displayTopCandidate(affinityScores[0]);
    
    // Mostrar afinidad por bloques temáticos
    displayThematicResults();
    
    // Mostrar todos los candidatos en grid
    displayAllCandidates(affinityScores);
}

// Función para mostrar el candidato principal
function displayTopCandidate(topResult) {
    const candidate = topResult.candidate;
    
    // Actualizar foto/iniciales
    const photoElement = document.getElementById('topCandidatePhoto');
    const initialsElement = document.getElementById('topCandidateInitials');
    
    if (candidate.photo) {
        photoElement.src = candidate.photo;
        photoElement.alt = candidate.name;
        photoElement.style.display = 'block';
        initialsElement.style.display = 'none';
    } else {
        initialsElement.textContent = candidate.initials;
        photoElement.style.display = 'none';
        initialsElement.style.display = 'flex';
    }
    
    // Actualizar información básica
    document.getElementById('topCandidateName').textContent = candidate.name;
    document.getElementById('topCandidateParty').textContent = candidate.party;
    
    // Inicializar porcentaje en 0
    const percentageElement = document.getElementById('topCandidatePercentage');
    percentageElement.textContent = '0% de afinidad';
    
    // Inicializar barra en 0
    const barElement = document.getElementById('topCandidateBar');
    barElement.style.width = '0%';
    
    // Animar porcentaje con conteo progresivo
    animatePercentage(percentageElement, topResult.percentage, 2000);
    
    // Animar barra de porcentaje
    setTimeout(() => {
        barElement.style.width = topResult.percentage + '%';
    }, 300);
}

// Función para animar el porcentaje con conteo progresivo
function animatePercentage(element, targetPercentage, duration) {
    const startTime = performance.now();
    const startValue = 0;
    
    function updatePercentage(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Usar easing function para suavizar la animación
        const easedProgress = easeOutCubic(progress);
        const currentValue = Math.round(startValue + (targetPercentage - startValue) * easedProgress);
        
        element.textContent = currentValue + '% de afinidad';
        
        if (progress < 1) {
            requestAnimationFrame(updatePercentage);
        }
    }
    
    requestAnimationFrame(updatePercentage);
}

// Función de easing para suavizar la animación
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Función para calcular y mostrar afinidad por bloques temáticos
function displayThematicResults() {
    const { thematicBlocks } = window.testData;
    const thematicContainer = document.getElementById('thematicResults');
    thematicContainer.innerHTML = '';
    
    thematicBlocks.forEach(block => {
        // Calcular afinidad para este bloque específico
        const blockAffinity = calculateBlockAffinity(block);
        
        const thematicCard = document.createElement('div');
        thematicCard.className = 'thematic-card';
        
        // Contenido de la foto (imagen o iniciales)
        const photoContent = blockAffinity.candidate.photo ? 
            `<img src="${blockAffinity.candidate.photo}" alt="${blockAffinity.candidate.name}">` :
            blockAffinity.candidate.initials;
        
        thematicCard.innerHTML = `
            <div class="thematic-title">${block.title}</div>
            <div class="thematic-candidate-photo">
                ${photoContent}
            </div>
            <div class="thematic-leader">${blockAffinity.candidate.name}</div>
            <div class="thematic-percentage">${blockAffinity.percentage}% de afinidad</div>
        `;
        
        thematicContainer.appendChild(thematicCard);
    });
}

// Función para calcular afinidad por bloque temático
function calculateBlockAffinity(block) {
    const { candidates, candidateScores } = window.testData;
    const blockScores = [];
    
    candidates.forEach((candidate, candidateIndex) => {
        let totalDistance = 0;
        let validQuestions = 0;
        
        block.questions.forEach(questionId => {
            const questionIndex = questionId - 1; // Convertir a índice base 0
            const userAnswer = userAnswers[questionIndex];
            
            if (userAnswer !== null) {
                const candidateAnswer = candidateScores[candidateIndex][questionIndex];
                const distance = Math.abs(userAnswer - candidateAnswer);
                totalDistance += distance;
                validQuestions++;
            }
        });
        
        // Calcular afinidad usando la misma fórmula
        let affinityPercentage = 0;
        if (validQuestions > 0) {
            const maxPossibleDistance = validQuestions * 4;
            const affinity = 1 - (totalDistance / maxPossibleDistance);
            affinityPercentage = Math.round(affinity * 100);
            affinityPercentage = Math.max(0, affinityPercentage);
        }
        
        blockScores.push({
            candidate: candidate,
            percentage: affinityPercentage,
            rawDistance: totalDistance,
            validQuestions: validQuestions
        });
    });
    
    // Retornar el candidato con mayor afinidad en este bloque
    blockScores.sort((a, b) => b.percentage - a.percentage);
    return blockScores[0];
}

// Función para mostrar todos los candidatos en grid
function displayAllCandidates(affinityScores) {
    const candidatesContainer = document.getElementById('candidatesResults');
    candidatesContainer.innerHTML = '';
    
    affinityScores.forEach((result, index) => {
        const candidateCard = document.createElement('div');
        candidateCard.className = 'candidate-card';
        
        const photoContent = result.candidate.photo ? 
            `<img src="${result.candidate.photo}" alt="${result.candidate.name}">` :
            result.candidate.initials;
        
        candidateCard.innerHTML = `
            <div class="candidate-photo">
                ${photoContent}
            </div>
            <div class="candidate-name">${result.candidate.name}</div>
            <div class="candidate-percentage">${result.percentage}%</div>
            <div class="percentage-bar">
                <div class="percentage-fill" style="width: 0%"></div>
            </div>
        `;
        
        candidatesContainer.appendChild(candidateCard);
        
        // Animar la barra de porcentaje
        setTimeout(() => {
            const fillBar = candidateCard.querySelector('.percentage-fill');
            fillBar.style.width = result.percentage + '%';
        }, 800 + (index * 100));
    });
}

// Función para reiniciar el test
function restartTest() {
    currentQuestionIndex = 0;
    userAnswers = [];
    userDemographics = {};
    
    // Limpiar formularios
    document.getElementById('age').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('department').value = '';
    
    // Volver a la pantalla de bienvenida
    hideAllSections();
    welcomeSection.classList.add('active');
}

// Función auxiliar para ocultar todas las secciones
function hideAllSections() {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
}

// Función para obtener estadísticas del test (opcional, para análisis)
function getTestStatistics() {
    return {
        demographics: userDemographics,
        answers: userAnswers,
        timestamp: new Date().toISOString(),
        duration: null // Se puede implementar un timer si es necesario
    };
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si se debe mostrar resultados directamente
    const urlParams = new URLSearchParams(window.location.search);
    const showResults = urlParams.get('showResults');
    
    if (showResults === 'true') {
        // Verificar si hay resultados guardados
        const savedAnswers = localStorage.getItem('userAnswers');
        const savedDemographics = localStorage.getItem('userDemographics');
        
        if (savedAnswers && savedDemographics) {
            // Restaurar datos guardados
            userAnswers = JSON.parse(savedAnswers);
            userDemographics = JSON.parse(savedDemographics);
            
            // Mostrar resultados directamente
            hideAllSections();
            showResults();
            return;
        }
    }
    
    // Asegurar que solo la sección de bienvenida esté visible
    hideAllSections();
    welcomeSection.classList.add('active');
    
    // Event listener para cerrar tooltip al hacer clic fuera
    document.getElementById('tooltip').addEventListener('click', function(e) {
        if (e.target === this) {
            hideTooltip();
        }
    });
    
    // Event listener para cerrar tooltip con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideTooltip();
        }
    });
    
    // Validación en tiempo real para el campo de edad
    const ageInput = document.getElementById('age');
    ageInput.addEventListener('input', function() {
        const age = parseInt(this.value);
        if (this.value && (isNaN(age) || age < 18)) {
            this.classList.add('field-error');
            this.classList.remove('field-valid');
        } else if (this.value) {
            this.classList.remove('field-error');
            this.classList.add('field-valid');
        } else {
            this.classList.remove('field-error', 'field-valid');
        }
    });
    
    // Validación en tiempo real para el campo de género
    const genderSelect = document.getElementById('gender');
    genderSelect.addEventListener('change', function() {
        if (this.value) {
            this.classList.remove('field-error');
            this.classList.add('field-valid');
        } else {
            this.classList.remove('field-error', 'field-valid');
        }
    });
    
    // Validación en tiempo real para el campo de departamento
    const departmentSelect = document.getElementById('department');
    departmentSelect.addEventListener('change', function() {
        if (this.value) {
            this.classList.remove('field-error');
            this.classList.add('field-valid');
        } else {
            this.classList.remove('field-error', 'field-valid');
        }
    });
    
    // Configurar event listeners adicionales si es necesario
    console.log('Test de Afinidad Política cargado correctamente');
    console.log(`${window.testData.questions.length} preguntas disponibles`);
    console.log(`${window.testData.candidates.length} candidatos configurados`);
});

// Función para compartir resultados
function shareResults() {
    const topCandidate = document.getElementById('topCandidateName').textContent;
    const topPercentage = document.getElementById('topCandidatePercentage').textContent;
    
    const shareText = `¡Acabo de completar el Test de Afinidad Política para las Elecciones 2024! Mi mayor afinidad es con ${topCandidate} (${topPercentage}). ¿Cuál será la tuya? Haz el test aquí: ${window.location.href}`;
    
    // Intentar usar la API nativa de compartir si está disponible
    if (navigator.share) {
        navigator.share({
            title: 'Mis Resultados - Test de Afinidad Política 2024',
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('Error al compartir:', err));
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(shareText).then(() => {
            // alert('¡Texto copiado al portapapeles! Ahora puedes pegarlo donde quieras compartirlo.');
        }).catch(err => {
            // Si tampoco funciona el portapapeles, mostrar el texto para que lo copie manualmente
            // prompt('Copia este texto para compartir tus resultados:', shareText);
        });
    }
}

// Funciones del modal de validación
function showValidationModal() {
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const department = document.getElementById('department').value;
    
    // Agregar clase de error a campos faltantes o inválidos
    if (!age || parseInt(age) < 18) {
        document.getElementById('age').classList.add('field-error');
        document.getElementById('age').classList.remove('field-valid');
    } else {
        document.getElementById('age').classList.remove('field-error');
        document.getElementById('age').classList.add('field-valid');
    }
    
    if (!gender) {
        document.getElementById('gender').classList.add('field-error');
        document.getElementById('gender').classList.remove('field-valid');
    } else {
        document.getElementById('gender').classList.remove('field-error');
        document.getElementById('gender').classList.add('field-valid');
    }
    
    if (!department) {
        document.getElementById('department').classList.add('field-error');
        document.getElementById('department').classList.remove('field-valid');
    } else {
        document.getElementById('department').classList.remove('field-error');
        document.getElementById('department').classList.add('field-valid');
    }
    
    const modal = document.getElementById('validationModal');
    modal.classList.add('show');
    
    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeValidationModal();
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeValidationModal();
        }
    });
}

function closeValidationModal() {
    const modal = document.getElementById('validationModal');
    modal.classList.remove('show');
}

// Event listeners para tooltip
document.addEventListener('DOMContentLoaded', function() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        // Cerrar tooltip al hacer clic fuera del contenido
        tooltip.addEventListener('click', function(e) {
            if (e.target === tooltip) {
                hideTooltip();
            }
        });
        
        // Cerrar tooltip con tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !tooltip.classList.contains('hidden')) {
                hideTooltip();
            }
        });
    }
});

// Funciones del navbar de resultados
function showSurveyInfo() {
    const surveyInfo = `
        <h4>Sobre la Encuesta de Afinidad Política</h4>
        <p><strong>Objetivo:</strong> Esta encuesta tiene como propósito medir la afinidad ideológica entre los ciudadanos y los candidatos políticos basándose en sus posiciones respecto a temas clave.</p>
        
        <p><strong>Metodología:</strong> El test utiliza 20 preguntas organizadas en 4 ejes temáticos:</p>
        <ul>
            <li><strong>Economía (5 preguntas):</strong> Políticas fiscales, rol del Estado en la economía, libre mercado</li>
            <li><strong>Social (5 preguntas):</strong> Derechos civiles, políticas sociales, diversidad</li>
            <li><strong>Político (5 preguntas):</strong> Democracia, instituciones, participación ciudadana</li>
            <li><strong>Coyuntural (5 preguntas):</strong> Temas de actualidad y situación política actual</li>
        </ul>
        
        <p><strong>Cálculo de Afinidad:</strong> Se comparan las respuestas del usuario con las posiciones conocidas de cada candidato para determinar el porcentaje de afinidad en cada área temática y en general.</p>
        
        <p><strong>Confidencialidad:</strong> Todas las respuestas son anónimas y no se almacenan datos personales identificables.</p>
    `;
    
    showTooltip('Sobre la Encuesta', surveyInfo);
}

function showJustifications() {
    const justifications = `
        <h4>Justificaciones Metodológicas</h4>
        <p><strong>Selección de Preguntas:</strong> Las preguntas fueron seleccionadas basándose en:</p>
        <ul>
            <li>Relevancia en el debate político actual</li>
            <li>Capacidad de diferenciación ideológica</li>
            <li>Representatividad de cada eje temático</li>
        </ul>
        
        <p><strong>Posicionamiento de Candidatos:</strong> Las posiciones de los candidatos se determinaron mediante:</p>
        <ul>
            <li>Análisis de propuestas de gobierno</li>
            <li>Declaraciones públicas oficiales</li>
            <li>Historial de votaciones y posiciones</li>
            <li>Programas de campaña</li>
        </ul>
        
        <p><strong>Sistema de Puntuación:</strong></p>
        <ul>
            <li>Totalmente de acuerdo: +2 puntos</li>
            <li>De acuerdo: +1 punto</li>
            <li>Neutro: 0 puntos</li>
            <li>En desacuerdo: -1 punto</li>
            <li>Totalmente en desacuerdo: -2 puntos</li>
        </ul>
        
        <p><strong>Cálculo de Afinidad:</strong> Se utiliza la fórmula de distancia euclidiana normalizada para calcular la similitud entre las respuestas del usuario y las posiciones de cada candidato.</p>
        
        <p><strong>Limitaciones:</strong> Este test es una aproximación basada en información pública disponible y no debe ser el único factor para decisiones electorales.</p>
    `;
    
    showTooltip('Justificaciones Metodológicas', justifications);
}

// Función de prueba para verificar el cálculo
function testCalculation() {
    // Respuestas de prueba que deberían dar 100% con Samuel Doria
    const testAnswers = [2, 2, -1, 2, 2, 1, -2, 2, 1, 2, 2, 2, 2, 2, 2, -1, 0, 1, 2, 0];
    
    console.log('=== PRUEBA DE CÁLCULO ===');
    console.log('Respuestas de prueba:', testAnswers);
    
    const { candidates, candidateScores } = window.testData;
    
    candidates.forEach((candidate, candidateIndex) => {
        let totalDistance = 0;
        let validQuestions = 0;

        testAnswers.forEach((userAnswer, questionIndex) => {
            if (userAnswer !== null) {
                const candidateAnswer = candidateScores[candidateIndex][questionIndex];
                const distance = Math.abs(userAnswer - candidateAnswer);
                totalDistance += distance;
                validQuestions++;
                
                if (candidateIndex === 0) { // Solo mostrar detalles para Samuel Doria
                    console.log(`Pregunta ${questionIndex + 1}: Usuario=${userAnswer}, ${candidate.name}=${candidateAnswer}, Distancia=${distance}`);
                }
            }
        });

        const maxPossibleDistance = validQuestions * 4;
        const affinity = 1 - (totalDistance / maxPossibleDistance);
        const affinityPercentage = Math.round(affinity * 100);
        
        console.log(`${candidate.name}: Distancia total=${totalDistance}, Afinidad=${affinityPercentage}%`);
    });
}

// Función para actualizar el fondo según el eje temático
function updateThematicBackground(questionIndex) {
    const questionsSection = document.getElementById('questions');
    const thematicTag = document.getElementById('thematicTag');
    
    // Remover todas las clases temáticas anteriores (ya no se usan)
    questionsSection.classList.remove('economia-theme', 'social-theme', 'politico-theme', 'coyuntural-theme');
    
    // Determinar el eje temático basado en el índice de la pregunta (cada 5 preguntas)
    if (questionIndex >= 0 && questionIndex < 5) {
        thematicTag.textContent = 'Economía';
    } else if (questionIndex >= 5 && questionIndex < 10) {
        thematicTag.textContent = 'Social';
    } else if (questionIndex >= 10 && questionIndex < 15) {
        thematicTag.textContent = 'Político';
    } else if (questionIndex >= 15 && questionIndex < 20) {
        thematicTag.textContent = 'Coyuntural';
    }
}

// Ejecutar prueba automáticamente cuando se carga la página (solo para depuración)
// Descomenta la siguiente línea para ejecutar la prueba
window.addEventListener('load', testCalculation);
