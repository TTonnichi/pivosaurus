import React, { useState, useEffect, useRef } from 'react';
import './HeartConstructor.css';
import { GiDinosaurRex } from "react-icons/gi";
import { FaHeart } from "react-icons/fa";
import { IoBeer } from "react-icons/io5";

interface HeartParams {
  H: number;
  B: number;
  I: number;
  L: number;
  U: number;
}

const HeartConstructor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [params, setParams] = useState<HeartParams>({
    H: 0,
    B: 0,
    I: 0,
    L: 0,
    U: 0
  });

  const [inputValues, setInputValues] = useState({
    H: '',
    B: '',
    I: '',
    L: '',
    U: ''
  });

  const [inputsLocked, setInputsLocked] = useState(false);

  const handleInputChange = (param: keyof HeartParams, value: string) => {
    if (inputsLocked) return;
    
    setInputValues(prev => ({
      ...prev,
      [param]: value
    }));

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setParams(prev => ({
        ...prev,
        [param]: numValue
      }));
    } else if (value === '') {
      setParams(prev => ({
        ...prev,
        [param]: 0
      }));
    }
  };

  const applyHint = (noteNumber: number) => {
    if (inputsLocked) return;
    
    switch(noteNumber) {
      case 0: handleInputChange('H', '16'); break;
      case 1: handleInputChange('B', '3'); break;
      case 2: handleInputChange('I', '13'); break;
      case 3: handleInputChange('L', '5'); break;
      case 4: handleInputChange('U', '2'); break;
      case 5: 
        setInputValues({ H: '', B: '', I: '', L: '', U: '' });
        setParams({ H: 0, B: 0, I: 0, L: 0, U: 0 });
        setInputsLocked(false);
        break;
    }
  };

  useEffect(() => {
    const allSet = Object.values(params).every(v => v !== 0);
    if (allSet) {
      setInputsLocked(true);
    }
  }, [params]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 10;

    // сетка
    ctx.strokeStyle = '#e8e8e8';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // оси
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // подписи
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px "Courier New"';
    ctx.fillText('X', width - 20, centerY - 10);
    ctx.fillText('Y', centerX + 10, 20);

    // сердечко
    const hasAnyParam = Object.values(params).some(v => v !== 0);
    
    if (hasAnyParam) {
      ctx.strokeStyle = '#ff3366';
      ctx.fillStyle = 'rgba(255, 51, 102, 0.1)';
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let t = -Math.PI; t <= Math.PI; t += 0.01) {
        const x = params.H * Math.pow(Math.sin(t), params.B);
        const y = params.I * Math.cos(t) 
                - params.L * Math.cos(2 * t) 
                - params.U * Math.cos(3 * t) 
                - Math.cos(4 * t);

        const plotX = centerX + x * scale;
        const plotY = centerY - y * scale;

        t === -Math.PI ? ctx.moveTo(plotX, plotY) : ctx.lineTo(plotX, plotY);
      }

      ctx.closePath();
      ctx.stroke();
      
      const allParamsSet = Object.values(params).every(v => v !== 0);
      if (allParamsSet) {
        ctx.fillStyle = 'rgba(255, 51, 102, 0.3)';
        ctx.fill();
      }
    }

    // уравнение
    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`x(t) = ${params.H || 'H'} · sin(t)^${params.B || 'B'}`, 20, 40);
    ctx.fillText(`y(t) = ${params.I || 'I'}·cos(t) - ${params.L || 'L'}·cos(2t) - ${params.U || 'U'}·cos(3t) - cos(4t)`, 20, 65);

  }, [params]);

  const allParamsSet = Object.values(params).every(v => v !== 0);

  return (
    <div className="heart-container">
      <div className="heart-header">
        <h1 className="heart-title">Готов ли ты к перевоплощению?</h1>
        <p className="heart-subtitle">
          Каждая записка – часть уравнения. Собери все пять, чтобы стать пивозавром.
        </p>
      </div>

      {/* график и уравнение */}
      <div className="center-block">
        <div className="canvas-wrapper">
          <div className="canvas-container">
            <canvas 
              ref={canvasRef} 
              width={800} 
              height={500}
              className="heart-canvas"
            />
          </div>
        </div>

        <div className="equation-display">
          <div className="equation-line">
            x(t) = <span className="param-value">{params.H || 'H'}</span> · sin(t)<sup>{params.B || 'B'}</sup>
          </div>
          <div className="equation-line">
            y(t) = <span className="param-value">{params.I || 'I'}</span>·cos(t) - 
            <span className="param-value"> {params.L || 'L'}</span>·cos(2t) - 
            <span className="param-value"> {params.U || 'U'}</span>·cos(3t) - cos(4t)
          </div>
        </div>
      </div>

      {/* поля для ввода (верхние) */}
      <div className="inputs-section">
        <div className="input-row top-row">
          {[
            { id: 'H', label: 'H', full: 'Happy', note: 0, hint: 'Записка 0' },
            { id: 'B', label: 'B', full: 'Birthday', note: 1, hint: 'Записка 1' }
          ].map(({ id, label, full, note, hint }) => (
            <div key={id} className="input-group">
              <div className="input-header">
                <span className="input-label">
                  <span className="param-symbol">{label}</span>
                  <span className="param-fullname">{full}</span>
                </span>
                <span className="input-hint">{hint}</span>
              </div>
              <input
                type="number"
                value={inputValues[id as keyof typeof inputValues]}
                onChange={(e) => handleInputChange(id as keyof HeartParams, e.target.value)}
                placeholder="?"
                className={`param-input ${inputsLocked ? 'locked' : ''}`}
                disabled={inputsLocked}
              />
              {!inputsLocked && (
                <button 
                  onClick={() => applyHint(note)}
                  className="hint-button small"
                >
                  Подсказка
                </button>
              )}
            </div>
          ))}
        </div>

        {/* нижние */}
        <div className="input-row bottom-row">
          {[
            { id: 'I', label: 'I', full: 'I', note: 2, hint: 'Записка 2' },
            { id: 'L', label: 'L', full: 'Love', note: 3, hint: 'Записка 3' },
            { id: 'U', label: 'U', full: 'You', note: 4, hint: 'Записка 4' }
          ].map(({ id, label, full, note, hint }) => (
            <div key={id} className="input-group">
              <div className="input-header">
                <span className="input-label">
                  <span className="param-symbol">{label}</span>
                  <span className="param-fullname">{full}</span>
                </span>
                <span className="input-hint">{hint}</span>
              </div>
              <input
                type="number"
                value={inputValues[id as keyof typeof inputValues]}
                onChange={(e) => handleInputChange(id as keyof HeartParams, e.target.value)}
                placeholder="?"
                className={`param-input ${inputsLocked ? 'locked' : ''}`}
                disabled={inputsLocked}
              />
              {!inputsLocked && (
                <button 
                  onClick={() => applyHint(note)}
                  className="hint-button small"
                >
                  Подсказка
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* сброс */}
      {!allParamsSet && (
        <div className="controls">
          <button 
            onClick={() => applyHint(5)}
            className="reset-button"
          >
            Сбросить всё
          </button>
        </div>
      )}

      {allParamsSet && (
        <div className="final-message">
          <h2 className="final-title">СЕРДЦЕ ЗАБИЛОСЬ!</h2>
          <div className="heart-animation">
            <GiDinosaurRex />
            <FaHeart />
            <IoBeer />
          </div>
          <div className="message-content">
            <p className="message-text">
              Ты собрал все части уравнения!
            </p>
            <div className="final-equation">
              x(t) = <span className="decoded-param">16</span>·sin(t)<sup><span className="decoded-param">3</span></sup><br/>
              y(t) = <span className="decoded-param">13</span>·cos(t) - 
              <span className="decoded-param"> 5</span>·cos(2t) - 
              <span className="decoded-param"> 2</span>·cos(3t) - cos(4t)
            </div>
            <p className="philosophy">
              Теперь ты настоящий пивозавр.<br/>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeartConstructor;