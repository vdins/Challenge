let countdownInterval;
let subtitleInterval;
let startTime;

function submitUsername() {
    const username = document.getElementById('username').value;
    if (username) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        const backsound = document.getElementById('backsound');
        backsound.play();
        startTime = new Date();
        startCountdown(backsound.duration);
        startSubtitle();
    } else {
        alert('Masukkan nama pengguna.');
    }
}

function giveUp() {
    const backsound = document.getElementById('backsound');
    backsound.pause();
    clearInterval(countdownInterval);
    clearInterval(subtitleInterval);
    const timeRemaining = document.getElementById('countdown').textContent.split(' ')[2];
    const username = document.getElementById('username').value;
    const message = `Saya menyerah di detik ${timeRemaining} challenge Fahri`;
    sendToDiscord(username, timeRemaining, false);
    redirectToWhatsApp(message);
}

function startCountdown(duration) {
    const countdownElement = document.getElementById('countdown');
    let timeRemaining = duration;
    countdownInterval = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            clearInterval(subtitleInterval);
            countdownElement.textContent = "Waktu habis!";
            const username = document.getElementById('username').value;
            const message = "Saya berhasil menamatkan challenge Fahri";
            sendToDiscord(username, duration, true);
            redirectToWhatsApp(message);
        } else {
            countdownElement.textContent = `Sisa waktu: ${Math.ceil(timeRemaining)} detik`;
            timeRemaining -= 1;
        }
    }, 1000);
}

function startSubtitle() {
    const subtitleElement = document.getElementById('subtitle');
    const subtitles = [
        "Semangat",
        "Kamu Pasti Bisa",
        "Jangan jadi GAY!",
        // Tambahkan subtitle sesuai dengan backsound
    ];
    let index = 0;
    subtitleInterval = setInterval(() => {
        subtitleElement.textContent = subtitles[index];
        index = (index + 1) % subtitles.length;
    }, 2000); // Ganti subtitle setiap 2 detik
}

function redirectToWhatsApp(message) {
    const phoneNumber = "+6283895152817";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
}

function sendToDiscord(username, time, completed) {
    const webhookUrl = "https://discordapp.com/api/webhooks/1263796801140559974/hwM5vVZjNO3RNIBTwCBoWns383dLzt2klMuAlktmBknjqxS-JTBCVnBMIwu4QNluBDQ8";
    const data = {
        content: null,
        embeds: [
            {
                title: "Hasil Tantangan",
                color: completed ? 3066993 : 15158332,
                fields: [
                    {
                        name: "Nama Pengguna",
                        value: username,
                        inline: true
                    },
                    {
                        name: "Waktu Bertahan",
                        value: `${time} detik`,
                        inline: true
                    },
                    {
                        name: "Status",
                        value: completed ? "Berhasil" : "Menyerah",
                        inline: true
                    }
                ],
                timestamp: new Date()
            }
        ]
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            console.error('Gagal mengirim data ke Discord');
        }
    }).catch(error => {
        console.error('Terjadi kesalahan:', error);
    });
}