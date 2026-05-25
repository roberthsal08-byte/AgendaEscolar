// Data storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let streak = parseInt(localStorage.getItem('streak')) || 0;
let schedule = [
{ time: '7:00', subject: 'Matemáticas', room: 'A-101', teacher: 'Lic. García', color: 'math' },
{ time: '8:00', subject: 'Historia', room: 'B-203', teacher: 'Mtra. López', color: 'history' },
{ time: '9:00', subject: 'Programación', room: 'C-305', teacher: 'Ing. Pérez', color: 'programming' },
{ time: '10:30', subject: 'Química', room: 'Lab-1', teacher: 'Dr. Ruiz', color: 'chemistry' }
];


    // Motivational phrases
    const motivations = [
        "Un poco de progreso cada día suma mucho. ¡Tú puedes!",
        "Peor sería reprobar. ¡Organízate!",
        "Cada tarea completada te acerca a tus metas.",
        "La constancia vence al talento.",
        "¡Tu futuro yo te lo agradecerá!",
        "Poco a poco se llega lejos.",
        "El éxito es la suma de pequeños esfuerzos diarios."
    ];

    // Initialize app
    document.addEventListener('DOMContentLoaded', function() {
        updateStats();
        renderSchedule();
        renderTasks();
        renderCalendar();
        updateMotivation();
        updateStreak();
        
        // Set today's date in task form
        document.getElementById('taskDate').valueAsDate = new Date();
    });

    // Navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });

    // Update stats
    function updateStats() {
        const pending = tasks.filter(t => !t.completed).length;
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('streakCount').textContent = streak;
        
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        document.getElementById('completion').textContent = percentage + '%';
    }

    // Render schedule
    function renderSchedule() {
        const container = document.getElementById('scheduleList');
        container.innerHTML = '';
        
        schedule.forEach(item => {
            const div = document.createElement('div');
            div.className = 'schedule-item';
            div.innerHTML = `
                <div class="schedule-time">${item.time}</div>
                <div class="schedule-subject">${item.subject}</div>
                <div class="schedule-details">
                    <i class="fas fa-door-open"></i> ${item.room} | 
                    <i class="fas fa-chalkboard-teacher"></i> ${item.teacher}
                </div>
            `;
            container.appendChild(div);
        });
    }

    // Task management
    function renderTasks() {
        const container = document.getElementById('tasksList');
        container.innerHTML = '';
        
        tasks.forEach((task, index) => {
            const div = document.createElement('div');
            div.className = `task-item ${task.completed ? 'completed' : ''}`;
            div.onclick = () => toggleTask(index);
            
            const colorClass = task.subject || 'math';
            div.innerHTML = `
                <div class="task-color ${colorClass}"></div>
                <div class="task-info">
                    <div class="task-name">${task.name}</div>
                    <div class="task-details">
                        ${task.subject || 'Sin materia'} | 
                        ${new Date(task.date).toLocaleDateString('es-ES', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                        })}
                    </div>
                </div>
                <span class="task-priority priority-${task.priority}">${task.priority.toUpperCase()}</span>
                <i class="fas fa-${task.completed ? 'check-circle' : 'circle'}"></i>
            `;
            container.appendChild(div);
        });
    }

    function addTask() {
        const task = {
            name: document.getElementById('taskName').value,
            subject: document.getElementById('taskSubject').value,
            date: document.getElementById('taskDate').value,
            priority: document.getElementById('taskPriority').value,
            completed: false
        };
        
        if (task.name.trim()) {
            tasks.unshift(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            updateStats();
            hideTaskForm();
            updateStreak();
        }
    }

    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        updateStats();
        updateStreak();
    }

    function showTaskForm() {
        document.getElementById('taskForm').style.display = 'block';
        document.getElementById('taskName').focus();
    }

    function hideTaskForm() {
        document.getElementById('taskForm').style.display = 'none';
        document.getElementById('taskName').value = '';
    }

    // Calendar
    function renderCalendar() {
        const container = document.getElementById('calendarContainer');
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        let calendarHTML = `
            <div class="calendar-header">
                <button onclick="prevMonth()" style="background: none; border: none; font-size: 20px; cursor: pointer;">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <span>${now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                <button onclick="nextMonth()" style="background: none; border: none; font-size: 20px; cursor: pointer;">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; margin-top: 15px;">
        `;
        
        // Days header
        const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
        days.forEach(day => {
            calendarHTML += `<div style="font-weight: 600; padding: 10px; text-align: center;">${day}</div>`;
        });
        
        // Empty cells
        const start = firstDay.getDay() || 7;
        for (let i = 1; i < start; i++) {
            calendarHTML += `<div class="calendar-day"></div>`;
        }
        
        // Days with events
        for (let day = 1; day <= daysInMonth; day++) {
            const hasEvent = Math.random() > 0.7; // Random events for demo
            calendarHTML += `
                <div class="calendar-day ${hasEvent ? 'event' : ''}">
                    ${day}
                    ${hasEvent ? '<div style="font-size: 10px;">📝</div>' : ''}
                </div>
            `;
        }
        
        calendarHTML += '</div>';
        container.innerHTML = calendarHTML;
    }

    let currentMonth = 0;
    function prevMonth() {
        currentMonth--;
        renderCalendar();
    }
    
    function nextMonth() {
        currentMonth++;
        renderCalendar();
    }

    // Streak system
    function updateStreak() {
        const today = new Date().toDateString();
        const lastCompleted = localStorage.getItem('lastCompleted');
        
        if (tasks.some(t => !t.completed)) {
            // Check if user completed tasks today
            if (lastCompleted !== today) {
                streak = 0;
            }
        } else {
            // User completed all tasks today
            if (lastCompleted !== today) {
                streak++;
                localStorage.setItem('lastCompleted', today);
            }
        }
        
        localStorage.setItem('streak', streak);
        document.getElementById('streakDisplay').textContent = streak;
        document.getElementById('streakCount').textContent = streak;
    }

    // AI Assistant
    function handleAI() {
        const input = document.getElementById('aiInput').value.toLowerCase().trim();
        const responseEl = document.getElementById('aiResponse');
        
        let response = '';
        
        if (input.includes('mucho') || input.includes('estres') || input.includes('no sé')) {
            response = '🌟 Respira profundo. Empieza por las tareas más cercanas (hoy/mñana). Una a la vez. ¡Tú puedes!';
        } else if (input.includes('mañana') || input.includes('preparar')) {
            response = '📚 Excelente actitud. Revisa tu horario y haz una lista de 3 tareas prioritarias para hoy.';
        } else if (input.includes('racha') || input.includes('motiva')) {
            response = '🔥 ¡Mantén esa energía! Completa 1 tarea ahora mismo para sumar a tu racha.';
        } else {
            response = '💡 Estoy aquí para ayudarte. Prueba decirme: "Tengo mucho que hacer" o "Necesito motivación".';
        }
        
        responseEl.textContent = response;
        responseEl.style.display = 'block';
        responseEl.scrollIntoView({ behavior: 'smooth' });
    }

    // Random motivation on load
    function updateMotivation() {
        const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
        document.getElementById('motivation').textContent = randomMotivation;
    }

    // Task form enter key
    document.getElementById('taskName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Auto-save tasks every 30 seconds
    setInterval(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, 30000);

    // Notification simulation (for demo)
    setTimeout(() => {
        if (Notification.permission === 'granted') {
            new Notification('StudyFlow', {
                body: '¡Tienes 4 tareas pendientes para hoy!',
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📚</text></svg>'
            });
        }
    }, 5000);