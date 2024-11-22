document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const expressionInput = document.getElementById("expressionInput");
    const drawButton = document.getElementById("drawButton");
    const resetButton = document.getElementById("resetButton");
    const saveButton = document.getElementById("saveButton");
    const colorPicker = document.getElementById("colorPicker");
    const gridToggle = document.getElementById("gridToggle");
  
    let scaleX = 25;
    let scaleY = 25;
    let offsetX = canvas.width / 2;
    let offsetY = canvas.height / 2;
    let functions = [];
  
    drawButton.addEventListener("click", () => {
      const expression = expressionInput.value.trim();
      if (expression) {
        functions.push({ expression, color: colorPicker.value });
        drawGraph();
      }
    });
  
    resetButton.addEventListener("click", () => {
      functions = [];
      offsetX = canvas.width / 2;
      offsetY = canvas.height / 2;
      scaleX = 25;
      scaleY = 25;
      drawGraph();
    });
  
    saveButton.addEventListener("click", saveGraph);
  
    function saveGraph() {
      const link = document.createElement("a");
      link.download = "doitinmaidinh.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  
    function drawGraph() {
      clearCanvas();
      if (gridToggle.checked) drawGrid();
      drawAxis();
  
      functions.forEach(({ expression, color }) => {
        plotFunction(expression, color);
        drawFunctionName(expression, color);
      });
    }
  
    function plotFunction(expression, color) {
      ctx.beginPath();
      let isMoving = true;
  
      for (let pixelX = 0; pixelX < canvas.width; pixelX++) {
        const realX = (pixelX - offsetX) / scaleX;
  
        try {
          const realY = evaluateExpression(expression, realX);
  
          if (isFinite(realY)) {
            const pixelY = offsetY - realY * scaleY;
  
            if (isMoving) {
              ctx.moveTo(pixelX, pixelY);
              isMoving = false;
            } else {
              ctx.lineTo(pixelX, pixelY);
            }
          } else {
            isMoving = true;
          }
        } catch {
          isMoving = true;
        }
      }
  
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  
    function drawAxis() {
      ctx.beginPath();
  
      // Trục X
      ctx.moveTo(0, offsetY);
      ctx.lineTo(canvas.width, offsetY);
  
      // Trục Y
      ctx.moveTo(offsetX, 0);
      ctx.lineTo(offsetX, canvas.height);
  
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1.5;
      ctx.stroke();
  
      // Đánh số trục X
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      for (let x = -canvas.width / 2; x <= canvas.width / 2; x += scaleX) {
        const realX = Math.round(x / scaleX);
        const canvasX = offsetX + x;
        if (canvasX > 0 && canvasX < canvas.width) {
          ctx.fillText(realX, canvasX, offsetY + 15);
        }
      }
  
      // Đánh số trục Y
      ctx.textAlign = "right";
      for (let y = -canvas.height / 2; y <= canvas.height / 2; y += scaleY) {
        const realY = Math.round(-y / scaleY);
        const canvasY = offsetY + y;
        if (canvasY > 0 && canvasY < canvas.height) {
          ctx.fillText(realY, offsetX - 5, canvasY + 4);
        }
      }
    }
  
    function drawGrid() {
      ctx.beginPath();
      ctx.strokeStyle = "#ddd";
  
      for (let x = 0; x < canvas.width; x += scaleX) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
  
      for (let y = 0; y < canvas.height; y += scaleY) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
  
      ctx.stroke();
    }
  
    function drawFunctionName(expression, color) {
      ctx.font = "14px Arial";
      ctx.fillStyle = color;
      ctx.textAlign = "left";
      ctx.fillText(`y = ${expression}`, 10, 20 + functions.indexOf(expression) * 20);
    }
  
    function evaluateExpression(expression, x) {
      const func = new Function(
        "x",
        `return ${expression
          .replace(/sin/g, "Math.sin")
          .replace(/cos/g, "Math.cos")
          .replace(/tan/g, "Math.tan")
          .replace(/sqrt/g, "Math.sqrt")
          .replace(/exp/g, "Math.exp")
          .replace(/\^/g, "**")}`
      );
      return func(x);
    }
  
    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });
  