const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 15;  // 15x15的棋盘
const CELL_SIZE = 40;  // 每个格子的大小
const PIECE_RADIUS = 18;  // 棋子的半径

let currentPlayer = 1;  // 1代表黑子，2代表白子
let gameBoard = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));  // 存储棋盘状态
let gameOver = false;  // 游戏是否结束

// 绘制棋盘
function drawBoard() {
    // 绘制棋盘背景
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制棋盘网格
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    
    // 绘制横线和竖线
    for (let i = 0; i < GRID_SIZE; i++) {
        // 横线
        ctx.beginPath();
        ctx.moveTo(CELL_SIZE, (i + 1) * CELL_SIZE);
        ctx.lineTo(CELL_SIZE * GRID_SIZE, (i + 1) * CELL_SIZE);
        ctx.stroke();
        
        // 竖线
        ctx.beginPath();
        ctx.moveTo((i + 1) * CELL_SIZE, CELL_SIZE);
        ctx.lineTo((i + 1) * CELL_SIZE, CELL_SIZE * GRID_SIZE);
        ctx.stroke();
    }
}

// 绘制棋子
function drawPiece(row, col, player) {
    const x = (col + 1) * CELL_SIZE;
    const y = (row + 1) * CELL_SIZE;
    
    ctx.beginPath();
    ctx.arc(x, y, PIECE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = player === 1 ? '#000' : '#fff';  // 黑子或白子
    ctx.fill();
    
    // 为白子添加黑色边框
    if (player === 2) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// 检查是否获胜
function checkWin(row, col) {
    const directions = [
        [[0, 1], [0, -1]],  // 水平方向
        [[1, 0], [-1, 0]],  // 垂直方向
        [[1, 1], [-1, -1]], // 主对角线
        [[1, -1], [-1, 1]]  // 副对角线
    ];
    
    for (const direction of directions) {
        let count = 1;
        for (const [dx, dy] of direction) {
            let r = row + dx;
            let c = col + dy;
            // 沿着一个方向计数相同颜色的棋子
            while (
                r >= 0 && r < GRID_SIZE &&
                c >= 0 && c < GRID_SIZE &&
                gameBoard[r][c] === currentPlayer
            ) {
                count++;
                r += dx;
                c += dy;
            }
        }
        if (count >= 5) return true;  // 五子连珠
    }
    return false;
}

// 处理鼠标点击事件
canvas.addEventListener('click', (e) => {
    if (gameOver) return;  // 游戏结束后不再响应点击
    
    // 获取点击位置对应的棋盘坐标
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.round(x / CELL_SIZE - 1);
    const row = Math.round(y / CELL_SIZE - 1);
    
    // 检查位置是否有效且未被占用
    if (
        row >= 0 && row < GRID_SIZE &&
        col >= 0 && col < GRID_SIZE &&
        gameBoard[row][col] === 0
    ) {
        // 放置棋子
        gameBoard[row][col] = currentPlayer;
        drawPiece(row, col, currentPlayer);
        
        // 检查是否获胜
        if (checkWin(row, col)) {
            alert(`${currentPlayer === 1 ? '黑子' : '白子'}获胜！`);
            gameOver = true;
            return;
        }
        
        // 切换玩家
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        document.getElementById('current-player').textContent = 
            `当前玩家：${currentPlayer === 1 ? '黑子' : '白子'}`;
    }
});

// 重新开始游戏
document.getElementById('restart').addEventListener('click', () => {
    // 重置游戏状态
    gameBoard = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    currentPlayer = 1;
    gameOver = false;
    document.getElementById('current-player').textContent = '当前玩家：黑子';
    drawBoard();
});

// 初始化游戏
drawBoard();