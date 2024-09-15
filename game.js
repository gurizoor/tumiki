const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ブロックの配列
let blocks = [];

// 重力の設定
const gravity = 0.5;
const friction = 0.0;

// 色付きブロックを追加する関数
function addBlock(color) {
    blocks.push({
        x: Math.random() * (canvas.width - 100), // ランダムなX座標
        y: 0, // 画面上部から落下
        width: 100,
        height: 100,
        color: color,
        dx: 0, // 水平方向の速度
        dy: 0, // 垂直方向の速度
        isDragging: false
    });
}

// ブロックを描画する関数
function drawBlocks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    blocks.forEach(block => {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);
    });
}

// ブロックに重力と当たり判定を適用
function applyPhysics() {
    blocks.forEach((block, index) => {
        // 重力を適用
        if (!block.isDragging) {
            block.dy += gravity;
            block.y += block.dy;
        }

        // 地面との当たり判定
        if (block.y + block.height > canvas.height) {
            block.y = canvas.height - block.height;
            block.dy *= -friction; // 反発（摩擦を適用）
        }

        // 他のブロックとの当たり判定
        blocks.forEach((otherBlock, otherIndex) => {
            if (index !== otherIndex) {
                if (block.y + block.height > otherBlock.y &&
                    block.y < otherBlock.y + otherBlock.height &&
                    block.x + block.width > otherBlock.x &&
                    block.x < otherBlock.x + otherBlock.width) {
                    block.y = otherBlock.y - block.height; // ブロックが上に乗る
                    block.dy = 0;
                }
            }
        });
    });
}

// マウスイベント関連
let selectedBlock = null;
let offsetX = 0;
let offsetY = 0;

canvas.addEventListener('mousedown', (e) => {
    const mousePos = getMousePos(canvas, e);
    selectedBlock = blocks.find(block =>
        mousePos.x >= block.x && mousePos.x <= block.x + block.width &&
        mousePos.y >= block.y && mousePos.y <= block.y + block.height
    );

    if (selectedBlock) {
        offsetX = mousePos.x - selectedBlock.x;
        offsetY = mousePos.y - selectedBlock.y;
        selectedBlock.isDragging = true;
        selectedBlock.dy = 0; // ドラッグ中は重力を無効化
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (selectedBlock && selectedBlock.isDragging) {
        const mousePos = getMousePos(canvas, e);
        selectedBlock.x = mousePos.x - offsetX;
        selectedBlock.y = mousePos.y - offsetY;
    }
});

canvas.addEventListener('mouseup', () => {
    if (selectedBlock) {
        selectedBlock.isDragging = false;
        selectedBlock = null;
    }
});

// マウス位置を取得する関数
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// ゲームループ
function gameLoop() {
    applyPhysics();
    drawBlocks();
    requestAnimationFrame(gameLoop);
}

// ボタンクリックイベントでブロック追加
document.getElementById('addRed').addEventListener('click', () => addBlock('red'));
document.getElementById('addBlue').addEventListener('click', () => addBlock('blue'));
document.getElementById('addGreen').addEventListener('click', () => addBlock('green'));

// ゲーム開始
gameLoop();
