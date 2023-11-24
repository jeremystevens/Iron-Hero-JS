window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Display the version number on the title screen
    const versionNumber = "0.2.3";
    // Update the version text
    document.getElementById('version').textContent = versionNumber;

    // Title music
    let titleMusic = new Audio('audio/menu.wav');
    titleMusic.loop = true;

    // Game music
    let gameMusic = new Audio('audio/game.mp3');
    gameMusic.loop = true;

    // Variables to track score and level
    let score = 0;
    let level = 1;

    // Variable to track player lives
    let lives = 3; // Start with 3 lives

    // Set the size for the player lives indicator
    const playerLivesIndicatorSize = 30;
    const playerLivesSpriteSize = 20;

    // Function to draw player lives using the player sprite
    function drawPlayerLives() {
        ctx.fillStyle = 'white';
        ctx.font = '27px Arial';

        // Display "Lives:" text
        ctx.fillText('Lives: ', 10, 30);

        // Fixed xOffset for each player sprite life
        const xOffset = 90;
        const yoffset = 10;
        // Draw scaled-down player sprites for each remaining life
        for (let i = 0; i < lives; i++) {
            // Calculate the position for each player sprite life
            const xPos = xOffset + i * (playerLivesSpriteSize + 5);
            // Draw the player sprite for lives with the adjusted size
            ctx.drawImage(playerImage, xPos, 10, playerLivesSpriteSize, playerLivesSpriteSize);
        }
    }

    // Player variables
    let playerImage = new Image();
    playerImage.src = 'images/player_sprite.png';

    let bulletImage = new Image();
    bulletImage.src = 'images/bullet_sprite.png';

    // define bullet sound and position
    let bulletSound = new Audio('audio/blaster.mp3');
    let bulletAdjustX = 10;
    let bulletAdjustY = 19;

    // Set up player object
    class Player {
        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.vx = 0;
            this.vy = 0;
            this.bullets = [];
            this.image = playerImage;
        }

        moveLeft() {
            this.vx = -5;
        }

        moveUp() {
            this.vy = -5;
        }

        moveRight() {
            this.vx = 5;
        }

        moveDown() {
            this.vy = 5;
        }

        stopMoving() {
            this.vx = 0;
            this.vy = 0;
        }

        shootBullet() {
            this.bullets.push({
                x: this.x + this.width / 2 - 5 + bulletAdjustX,
                y: this.y + bulletAdjustY,
                width: 10,
                height: 10,
            });
            bulletSound.play();
        }

        updateBullets() {
            for (let i = 0; i < this.bullets.length; i++) {
                let bullet = this.bullets[i];
                bullet.x += 10; // Replace with bullet's speed
            }
        }
    }

    let player = new Player(canvas.width / 2, canvas.height - 100, 50, 50);

    // Title screen image
    let titleScreen = new Image();
    titleScreen.onload = function() {
        ctx.drawImage(titleScreen, 0, 0, canvas.width, canvas.height);
        drawButtons();
    };
    titleScreen.src = 'images/title_screen_image.png';

    // Button dimensions and positions
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonColor = '#004A7F';
    const buttonTextColor = '#FFFFFF';
    const font = '36px Arial';

    // Function to draw score and level
    function drawGameInfo() {
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';

        // Display "Level:" text
        ctx.fillText('Level: ' + level, canvas.width - 250, 30);

        // Display "Score:" text
        ctx.fillText('Score: ' + score, canvas.width - 150, 30);

        drawPlayerLives();
    }

    // Draw buttons and text
    function drawButtons() {
        ctx.fillStyle = buttonColor;

        // Play button
        const playButtonRect = {
            x: canvas.width / 2 - buttonWidth / 2,
            y: 250,
            width: buttonWidth,
            height: buttonHeight
        };
        ctx.fillRect(playButtonRect.x, playButtonRect.y, playButtonRect.width, playButtonRect.height);

        // Settings button
        const settingsButtonRect = {
            x: canvas.width / 2 - buttonWidth / 2,
            y: 320,
            width: buttonWidth,
            height: buttonHeight
        };
        ctx.fillRect(settingsButtonRect.x, settingsButtonRect.y, settingsButtonRect.width, settingsButtonRect.height);

        // Draw button text
        ctx.fillStyle = buttonTextColor;
        ctx.font = font;
        drawCenteredText("Play", playButtonRect);
        drawCenteredText("Settings", settingsButtonRect);

        // Draw copyright text
        ctx.font = "16px Arial";
        ctx.fillStyle = 'white';
        const copyrightText = "© 2023 Jeremy Stevens";
        const textWidth = ctx.measureText(copyrightText).width;
        const textX = canvas.width - textWidth - 10; // 10 pixels from the right edge
        const textY = canvas.height - 10; // 10 pixels from the bottom edge
        ctx.fillText(copyrightText, textX, textY);
    }

    function drawCenteredText(text, rect) {
        const textWidth = ctx.measureText(text).width;
        const textX = rect.x + (rect.width - textWidth) / 2;
        const textY = rect.y + (rect.height + 30) / 2;
        ctx.fillText(text, textX, textY);
    }

    // Add event listener for canvas click
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Play button
        const playButtonRect = {
            x: canvas.width / 2 - buttonWidth / 2,
            y: 250,
            width: buttonWidth,
            height: buttonHeight
        };
        if (
            x > playButtonRect.x &&
            x < playButtonRect.x + playButtonRect.width &&
            y > playButtonRect.y &&
            y < playButtonRect.y + playButtonRect.height
        ) {
            titleMusic.pause(); // Pause title music
            startCountdown();
        }

        // Settings button
        const settingsButtonRect = {
            x: canvas.width / 2 - buttonWidth / 2,
            y: 320,
            width: buttonWidth,
            height: buttonHeight
        };
        if (
            x > settingsButtonRect.x &&
            x < settingsButtonRect.x + settingsButtonRect.width &&
            y > settingsButtonRect.y &&
            y < settingsButtonRect.y + settingsButtonRect.height
        ) {
            // handle settings button click TODO - add settings screen
            console.log("Settings button clicked");
        }
    });

    // Countdown logic
    let countdownValue = 5; // Starting value of the countdown

    function startCountdown() {
        if (countdownValue > 0) {
            playCountdownSound(countdownValue);
            drawCountdownNumber(countdownValue);
            countdownValue--;

            setTimeout(startCountdown, 1000); // Wait 1 second before the next number
        } else {
            // Countdown finished, proceed with starting the game
            startGame();
        }
    }

    function playCountdownSound(number) {
        let sound = new Audio('audio/' + number + ".mp3");
        sound.play();
    }

    function drawCountdownNumber(number) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const bigFont = "120px Arial";
        ctx.font = bigFont;
        ctx.fillStyle = 'white';
        const text = number.toString();
        const textWidth = ctx.measureText(text).width;
        ctx.fillText(text, (canvas.width - textWidth) / 2, canvas.height / 2);
    }

    // Scrolling background
    let bgImage = new Image();
    bgImage.src = "images/background.png";
    let x1 = 0;
    let x2 = canvas.width;
    let speed = 17;

    // Game loop
    function gameLoop() {
        // Start playing the game music game.wav
        gameMusic.play();

        // Scroll the background
        x1 -= speed;
        x2 -= speed;

        if (x1 < -canvas.width) {
            x1 = canvas.width;
        }
        if (x2 < -canvas.width) {
            x2 = canvas.width;
        }

        // Draw the images
        ctx.drawImage(bgImage, x1, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImage, x2, 0, canvas.width, canvas.height);

        // Update player position
        player.x += player.vx;
        player.y += player.vy;

        // Check bounds
        if (player.x < 0) player.x = 0;
        if (player.y < 0) player.y = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

        // Draw the player
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

        // Draw the bullets
        for (let i = 0; i < player.bullets.length; i++) {
            let bullet = player.bullets[i];
            ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
        }

        // Update bullet positions
        player.updateBullets();

        // Remove bullets that are off the screen
        player.bullets = player.bullets.filter(function(bullet) {
            return bullet.x < canvas.width;
        });

        // Draw game info (score and level)
        drawGameInfo();

        // Request next frame
        requestAnimationFrame(gameLoop);
    }

    // Start the game loop here
    function startGame() {
        // Start game loop
        requestAnimationFrame(gameLoop);
    }

    // Update player movement
    function updatePlayerMovement() {
        // Initialize velocity
        player.vx = 0;
        player.vy = 0;
    
        if (keys[37]) { // Left arrow
            player.vx = -5;
        }
        if (keys[38]) { // Up arrow
            player.vy = -5;
        }
        if (keys[39]) { // Right arrow
            player.vx = 5;
        }
        if (keys[40]) { // Down arrow
            player.vy = 5;
        }
    }

    // Handle keyboard input
    let keys = {};

window.addEventListener('keydown', function(event) {
    keys[event.keyCode] = true;
    if (event.keyCode === 32) { // Spacebar
        player.shootBullet();
    }
    updatePlayerMovement();
});

window.addEventListener('keyup', function(event) {
    keys[event.keyCode] = false;
    updatePlayerMovement();
});

    // Create an Audio object
    let menuMusic = new Audio('audio/menu.wav');

    // Play the music when the page is loaded
    window.addEventListener('load', function() {
        menuMusic.play();
    });
}; // end of file
