const foodData = {
    "elma": { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
    "yumurta": { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    "tavuk": { calories: 165, protein: 31, carbs: 0, fat: 4 },
    "pirinç": { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    "makarna": { calories: 131, protein: 5, carbs: 25, fat: 1.1 }
};

const meals = [];

const mealForm = document.getElementById('mealForm');
const mealList = document.querySelector('.meals');
const totalCaloriesEl = document.getElementById('totalCalories');
const pages = document.querySelectorAll('.page');
const tabButtons = document.querySelectorAll('.tabs button');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.page).classList.add('active');
    });
});

mealForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('mealName');
    const amountInput = document.getElementById('mealAmount');
    const name = nameInput.value.trim().toLowerCase();
    const amount = parseInt(amountInput.value, 10);

    if (!foodData[name]) {
        alert('Bu yiyecek veri tabanında bulunamadı.');
        return;
    }

    const info = foodData[name];
    const ratio = amount / 100;
    const meal = {
        name: nameInput.value.trim(),
        calories: Math.round(info.calories * ratio),
        protein: +(info.protein * ratio).toFixed(1),
        carbs: +(info.carbs * ratio).toFixed(1),
        fat: +(info.fat * ratio).toFixed(1)
    };

    meals.push(meal);
    renderMeals();
    mealForm.reset();
});

function renderMeals() {
    mealList.innerHTML = '';
    let totalCalories = 0;
    meals.forEach(meal => {
        totalCalories += meal.calories;
        const li = document.createElement('li');
        li.className = 'meal-item';
        li.innerHTML = `
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80" alt="${meal.name}">
            <div>
                <strong>${meal.name}</strong><br>
                ${meal.calories} kcal - P:${meal.protein}g K:${meal.carbs}g Y:${meal.fat}g
            </div>
        `;
        mealList.appendChild(li);
    });
    totalCaloriesEl.textContent = totalCalories;
    updateChart();
}

const ctx = document.getElementById('calorieChart').getContext('2d');
const calorieChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
        datasets: [{
            label: 'Kalori',
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: '#4f46e5'
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function updateChart() {
    const today = new Date().getDay(); // 0-6
    calorieChart.data.datasets[0].data[today === 0 ? 6 : today - 1] = parseInt(totalCaloriesEl.textContent, 10);
    calorieChart.update();
}
