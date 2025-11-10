const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('.gsap-fade').forEach(element => {
    gsap.fromTo(element,
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        }
    );
});

document.addEventListener('DOMContentLoaded', function () {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: '#9ca3af',
                    font: {
                        size: 12,
                        family: 'Inter'
                    }
                }
            }
        }
    };

    const technicalCtx = document.getElementById('technicalSkillsChart').getContext('2d');
    new Chart(technicalCtx, {
        type: 'bar',
        data: {
            labels: ['JavaScript', 'React', 'Node.js', 'Python', 'HTML/CSS', 'MongoDB'],
            datasets: [{
                label: 'Proficiency (%)',
                data: [95, 90, 88, 85, 92, 80],
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            ...chartOptions,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#9ca3af',
                        callback: value => value + '%'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                },
                y: {
                    ticks: {
                        color: '#9ca3af'
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                ...chartOptions.plugins,
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                    borderWidth: 1,
                    callbacks: {
                        label: context => context.parsed.x + '%'
                    }
                }
            }
        }
    });

    const professionalCtx = document.getElementById('professionalSkillsChart').getContext('2d');
    new Chart(professionalCtx, {
        type: 'doughnut',
        data: {
            labels: ['Communication', 'Teamwork', 'Problem Solving', 'Creativity', 'Leadership'],
            datasets: [{
                data: [92, 90, 94, 88, 85],
                backgroundColor: [
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(236, 72, 153, 0.8)'
                ],
                borderColor: [
                    'rgba(168, 85, 247, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(249, 115, 22, 1)',
                    'rgba(236, 72, 153, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            ...chartOptions,
            plugins: {
                ...chartOptions.plugins,
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#9ca3af',
                        padding: 15,
                        font: {
                            size: 11,
                            family: 'Inter'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                    borderWidth: 1,
                    callbacks: {
                        label: context => context.label + ': ' + context.parsed + '%'
                    }
                }
            }
        }
    });
});