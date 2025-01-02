const DISCORD_IDS = [
    "1304774554584875029",
    "1049561187274207232",
    "1184454687865438218",
    "1258358721675792435",
    "1227537724194422790",
    "1252572897445285965"
];

const updateLanyardPresence = () => {
    const promises = DISCORD_IDS.map(id =>
        fetch(`https://api.lanyard.rest/v1/users/${id}`).then(res => res.json())
    );

    Promise.all(promises).then(results => {
        const leftTrail = document.querySelector('.button-trail-left');
        const rightTrail = document.querySelector('.button-trail-right');

        const presenceHTML = results.map(data => {
            const {
                discord_user,
                discord_status,
                activities,
                spotify
            } = data.data;

            let activityDisplay = '';

            if (spotify) {
                activityDisplay = `
                    <div class="activity-details">
                        <div class="activity-type">
                            <i class="fas fa-music"></i> Listening to Spotify
                        </div>
                        <div class="activity-name">${spotify.song}</div>
                        <div class="activity-info">by ${spotify.artist}</div>
                    </div>`;
            } else if (activities && activities.length > 0) {
                const activity = activities[0];
                const customStatus = activities.find(act => act.type === 4);

                if (customStatus) {
                    activityDisplay = `
                        <div class="activity-details">
                            <div class="activity-type">
                                ${customStatus.emoji?.id ? 
                                    `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.png" alt="emoji" style="width: 20px; height: 20px;">` 
                                    : ''} 
                                ${customStatus.state || ''}
                            </div>
                        </div>`;
                } else {
                    const activityIcon = {
                        0: '🎮',
                        1: '🎨',
                        2: '🎵',
                        3: '📺',
                        4: '💭',
                        5: '🏆'
                    } [activity.type] || '🎮';

                    activityDisplay = `
                        <div class="activity-details">
                            <div class="activity-type">
                                ${activityIcon} ${getActivityTypeText(activity.type)} ${activity.name}
                            </div>
                            ${activity.details ? `<div class="activity-info">${activity.details}</div>` : ''}
                            ${activity.state ? `<div class="activity-state">${activity.state}</div>` : ''}
                            ${activity.timestamps ? `
                                <div class="activity-time">
                                    Playing for ${Math.floor((Date.now() - activity.timestamps.start) / 1000 / 60)} minutes
                                </div>
                            ` : ''}
                        </div>`;
                }
            }
            return `
                <a href="#" class="trail-btn">
                    <img src="https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}" alt="Discord Avatar">
                    ${discord_user.username}
                    <span class="status ${discord_status}"></span>
                    <div class="presence-popup">
                        ${activityDisplay || 'No current activity'}
                    </div>
                </a>
            `;
        }).join('');

        leftTrail.innerHTML = presenceHTML;
        rightTrail.innerHTML = presenceHTML;
    });
};

function getActivityTypeText(type) {
    const types = {
        0: 'Playing',
        1: 'Streaming',
        2: 'Listening to',
        3: 'Watching',
        4: 'Custom Status:',
        5: 'Competing in'
    };
    return types[type] || 'Playing';
}



setInterval(updateLanyardPresence, 5000);
updateLanyardPresence();


document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');

    musicToggle.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            musicToggle.style.opacity = '1';
        } else {
            music.pause();
            musicToggle.style.opacity = '0.5';
        }
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'transparent';
    }
});

const stats = document.querySelectorAll('.stat-card h2');
const animateStats = () => {
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            stat.textContent = Math.floor(current) + '+';
            if (current >= target) {
                stat.textContent = target + '+';
                clearInterval(timer);
            }
        }, 10);
    });
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
});

document.querySelector('.stats').forEach(stat => observer.observe(stat));
document.querySelectorAll('.gradient-animate').forEach(element => {
    element.addEventListener('mouseover', () => {
        element.style.backgroundPosition = '100% 50%';
    });

    element.addEventListener('mouseout', () => {
        element.style.backgroundPosition = '0% 50%';
    });
});
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX * 0.05) / 8;
    const moveY = (e.clientY * 0.05) / 8;

    document.querySelectorAll('.parallax').forEach(element => {
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

function createTrails() {
    const leftTrail = document.querySelector('.button-trail-left');
    const rightTrail = document.querySelector('.button-trail-right');

    for (let i = 0; i < 10; i++) {
        const leftButton = document.createElement('button');
        leftButton.classList.add('trail-button');
        leftButton.style.animationDelay = `${i * 0.8}s`;
        leftTrail.appendChild(leftButton);

        const rightButton = document.createElement('button');
        rightButton.classList.add('trail-button');
        rightButton.style.animationDelay = `${i * 0.8}s`;
        rightTrail.appendChild(rightButton);
    }
}

createTrails();