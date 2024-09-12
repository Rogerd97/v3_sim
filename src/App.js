import React, { useState, useEffect } from "react";
import "./App.css";

const cultivos = {
  cafe: {
    nombre: "Café",
    montoMin: 7000000,
    montoMax: 9000000,
    plazo: 18,
    modalidades: ["Semestral", "Mensual"],
  },
  papa: {
    nombre: "Papa",
    montoMin: 6000000,
    montoMax: 10000000,
    plazo: 12,
    modalidades: ["Bimensual", "Mensual"],
  },
  arroz: {
    nombre: "Arroz",
    montoMin: 8000000,
    montoMax: 15000000,
    plazo: 12,
    modalidades: ["Bimensual", "Cuatrimestral", "Semestral", "Mensual"],
  },
  platano: {
    nombre: "Plátano",
    montoMin: 2000000,
    montoMax: 6000000,
    plazo: 12,
    modalidades: ["Mensual", "Bimensual", "Trimestral"],
  },
  banano: {
    nombre: "Banano",
    montoMin: 2000000,
    montoMax: 6000000,
    plazo: 12,
    modalidades: ["Mensual", "Bimensual", "Trimestral"],
  },
};

const fngComisionMenor32500000 = {
  2: 0.0042,
  3: 0.0063,
  4: 0.0083,
  5: 0.0104,
  6: 0.0125,
  7: 0.0146,
  8: 0.0167,
  9: 0.0188,
  10: 0.0208,
  11: 0.0229,
  12: 0.025,
  13: 0.0252,
  14: 0.0256,
  15: 0.0263,
  16: 0.0271,
  17: 0.0281,
  18: 0.0292,
  19: 0.0304,
  20: 0.0317,
  21: 0.0331,
  22: 0.0346,
  23: 0.0361,
  24: 0.0376,
  25: 0.0382,
  26: 0.0389,
  27: 0.0397,
  28: 0.0406,
  29: 0.0416,
  30: 0.0426,
  31: 0.0438,
  32: 0.0449,
  33: 0.0462,
  34: 0.0475,
  35: 0.0488,
  36: 0.0502,
  37: 0.0509,
  38: 0.0517,
  39: 0.0526,
  40: 0.0535,
  41: 0.0545,
  42: 0.0555,
  43: 0.0566,
  44: 0.0577,
  45: 0.0589,
  46: 0.0601,
  47: 0.0613,
  48: 0.0626,
  49: 0.0634,
  50: 0.0642,
  51: 0.0651,
  52: 0.066,
  53: 0.067,
  54: 0.068,
  55: 0.0691,
  56: 0.0701,
  57: 0.0713,
  58: 0.0724,
  59: 0.0736,
  60: 0.0748,
};

const fngComisionMayor32500000 = {
  2: 0.0046,
  3: 0.0069,
  4: 0.0092,
  5: 0.0115,
  6: 0.0138,
  7: 0.016,
  8: 0.0183,
  9: 0.0189,
  10: 0.0229,
  11: 0.0252,
  12: 0.0275,
  13: 0.0277,
  14: 0.0282,
  15: 0.0289,
  16: 0.0298,
  17: 0.0309,
  18: 0.0321,
  19: 0.0335,
  20: 0.0349,
  21: 0.0364,
  22: 0.038,
  23: 0.0397,
  24: 0.0414,
  25: 0.042,
  26: 0.0428,
  27: 0.0437,
  28: 0.0447,
  29: 0.0457,
  30: 0.0469,
  31: 0.0481,
  32: 0.0494,
  33: 0.0508,
  34: 0.0522,
  35: 0.0537,
  36: 0.0552,
  37: 0.056,
  38: 0.0569,
  39: 0.0578,
  40: 0.0588,
  41: 0.0599,
  42: 0.061,
  43: 0.0622,
  44: 0.0635,
  45: 0.0648,
  46: 0.0661,
  47: 0.0674,
  48: 0.0688,
  49: 0.0697,
  50: 0.0706,
  51: 0.0716,
  52: 0.0726,
  53: 0.0737,
  54: 0.0748,
  55: 0.076,
  56: 0.0772,
  57: 0.0784,
  58: 0.0796,
  59: 0.0809,
  60: 0.0822,
};

const tasasInteres = [
  { min: 1000000, max: 3000000, ea: 0.69, nmv: 0.5364, mv: 0.0447 },
  { min: 3000001, max: 5000000, ea: 0.68, nmv: 0.5302, mv: 0.0442 },
  { min: 5000001, max: 7800000, ea: 0.68, nmv: 0.5302, mv: 0.0442 },
  { min: 7800001, max: 15600000, ea: 0.2526, nmv: 0.2273, mv: 0.0189 },
  { min: 15600001, max: 32500000, ea: 0.2526, nmv: 0.2273, mv: 0.0189 },
  { min: 32500001, max: 156000000, ea: 0.3974, nmv: 0.3393, mv: 0.0283 },
];

const leyMipyme = [
  { min: 1300000, max: 5200000, comision: 0.075 },
  { min: 5200001, max: 32500000, comision: 0.045 },
];

const App = () => {
  const [cultivoSeleccionado, setCultivoSeleccionado] = useState("");
  const [monto, setMonto] = useState("");
  const [plazo, setPlazo] = useState("");
  const [modalidadPago, setModalidadPago] = useState("");
  const [amortizacion, setAmortizacion] = useState([]);
  const [error, setError] = useState("");
  const [plazoMaximo, setPlazoMaximo] = useState(0);
  const [hectareas, setHectareas] = useState("");
  const [fngRate, setFngRate] = useState(0);
  const [mipymeRate, setMipymeRate] = useState(0);
  const [interestRate, setInterestRate] = useState(0);

  useEffect(() => {
    if (cultivoSeleccionado && modalidadPago) {
      const cultivo = cultivos[cultivoSeleccionado];
      const frecuenciaPago = {
        Mensual: 1,
        Bimensual: 2,
        Trimestral: 3,
        Cuatrimestral: 4,
        Semestral: 6,
      };
      const maxPeriodos = Math.floor(
        cultivo.plazo / frecuenciaPago[modalidadPago]
      );
      setPlazoMaximo(maxPeriodos);
      setPlazo(Math.min(plazo, maxPeriodos));
    }
  }, [cultivoSeleccionado, modalidadPago]);

  useEffect(() => {
    if (monto && plazo) {
      const montoNum = parseFloat(monto);
      setFngRate(calcularFNG(montoNum, plazo));
      setMipymeRate(calcularMipyme(montoNum));
      setInterestRate(calcularTasaInteres(montoNum));
    }
  }, [monto, plazo]);

  const calcularFNG = (monto, plazo) => {
    if (monto <= 32500000) {
      return fngComisionMenor32500000[plazo] || 0;
    } else {
      return fngComisionMayor32500000[plazo] || 0;
    }
  };

  const calcularMipyme = (monto) => {
    for (const rango of leyMipyme) {
      if (monto >= rango.min && monto <= rango.max) {
        return rango.comision;
      }
    }
    return 0;
  };

  const calcularTasaInteres = (monto) => {
    for (const rango of tasasInteres) {
      if (monto >= rango.min && monto <= rango.max) {
        return rango.mv;
      }
    }
    return 0;
  };

  const calcularAmortizacion = (
    capital,
    interes,
    plazo,
    modalidad,
    fng,
    mipyme
  ) => {
    const frecuenciaPago = {
      Mensual: 1,
      Bimensual: 2,
      Trimestral: 3,
      Cuatrimestral: 4,
      Semestral: 6,
    };

    const periodos = plazo / frecuenciaPago[modalidad];
    const tasaPeriodica = Math.pow(1 + interes, frecuenciaPago[modalidad]) - 1;

    const cuotaConstante =
      (capital * tasaPeriodica) / (1 - Math.pow(1 + tasaPeriodica, -periodos));
    const fngTotal = capital * fng;
    const mipymeTotal = capital * mipyme;
    const fngCuota = (fngTotal + fngTotal * 0.19) / periodos;
    const mipymeCuota = (mipymeTotal + mipymeTotal * 0.19) / periodos;

    let amortizacion = [];
    let saldo = capital;

    for (let i = 1; i <= periodos; i++) {
      let interesCuota = saldo * tasaPeriodica;
      let capitalCuota = cuotaConstante - interesCuota;
      saldo -= capitalCuota;

      amortizacion.push({
        cuota: i,
        cuotaConstante: cuotaConstante.toFixed(2),
        capitalCuota: capitalCuota.toFixed(2),
        interesCuota: interesCuota.toFixed(2),
        fngCuota: fngCuota.toFixed(2),
        mipymeCuota: mipymeCuota.toFixed(2),
        cuotaTotal: (cuotaConstante + fngCuota + mipymeCuota).toFixed(2),
        saldoRestante: saldo.toFixed(2),
      });
    }

    return amortizacion;
  };

  const handleCultivoChange = (event) => {
    const cultivoKey = event.target.value;
    const cultivo = cultivos[cultivoKey];

    if (cultivo) {
      setCultivoSeleccionado(cultivoKey);
      setMonto("");
      setPlazo(cultivo.plazo);
      setModalidadPago(cultivo.modalidades[0]);
      setAmortizacion([]);
    } else {
      setCultivoSeleccionado("");
      setMonto("");
      setPlazo("");
      setModalidadPago("");
      setAmortizacion([]);
    }
  };

  const handleMontoChange = (event) => {
    const valor = parseFloat(event.target.value);
    setMonto(valor);
  };

  const handlePlazoChange = (event) => {
    const valor = parseInt(event.target.value, 10);
    if (valor > plazoMaximo) {
      setError(
        `El plazo máximo para esta modalidad es de ${plazoMaximo} periodos.`
      );
    } else {
      setError("");
      setPlazo(valor);
    }
  };

  const handleModalidadChange = (event) => {
    setModalidadPago(event.target.value);
    setPlazo("");
  };

  const handleHectareasChange = (event) => {
    const valor = parseInt(event.target.value, 10);
    setHectareas(valor);
  };

  const handleCalcular = () => {
    if (!cultivoSeleccionado || !monto || !plazo || !modalidadPago) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (monto < 1000000) {
      setError("El monto mínimo es de 1 millón de COP.");
      return;
    }
    const capital = parseFloat(monto);
    const amort = calcularAmortizacion(
      capital,
      interestRate,
      plazo,
      modalidadPago,
      fngRate,
      mipymeRate
    );
    setAmortizacion(amort);
    setError("");
  };

  const handleReiniciar = () => {
    setCultivoSeleccionado("");
    setMonto("");
    setPlazo("");
    setModalidadPago("");
    setAmortizacion([]);
    setError("");
    setHectareas("");
    setFngRate(0);
    setMipymeRate(0);
    setInterestRate(0);
  };

  return (
    <div className="chat-container">
      <div className="chat-message">
        <p>
          👋 ¡Bienvenido al Simulador de Créditos Agro! Para comenzar,
          selecciona el cultivo que deseas financiar.
        </p>
        <label>Selecciona el cultivo:</label>
        <select value={cultivoSeleccionado} onChange={handleCultivoChange}>
          <option value="">-- Selecciona un cultivo --</option>
          {Object.entries(cultivos).map(([key, cultivo]) => (
            <option key={key} value={key}>
              {cultivo.nombre}
            </option>
          ))}
        </select>
      </div>

      {cultivoSeleccionado && (
        <div className="chat-message">
          <p>✅ Cultivo seleccionado: {cultivos[cultivoSeleccionado].nombre}</p>
          <p>
            Recuerda que el monto a financiar por hectárea es de:{" "}
            {cultivos[cultivoSeleccionado].montoMin.toLocaleString("es-CO")} a{" "}
            {cultivos[cultivoSeleccionado].montoMax.toLocaleString("es-CO")}{" "}
            COP.
          </p>
          <label>Número de hectáreas:</label>
          <input
            type="number"
            value={hectareas}
            onChange={handleHectareasChange}
            min="1"
          />
          {hectareas && (
            <p>
              Monto financiable estimado:{" "}
              {(
                hectareas * cultivos[cultivoSeleccionado].montoMin
              ).toLocaleString("es-CO")}{" "}
              a{" "}
              {(
                hectareas * cultivos[cultivoSeleccionado].montoMax
              ).toLocaleString("es-CO")}{" "}
              COP
            </p>
          )}
          <p>💵 Ingresa el monto a solicitar en COP (mínimo 1.000.000):</p>
          <input
            type="number"
            value={monto}
            onChange={handleMontoChange}
            min="1000000"
            step="1000"
          />
          <p>
            🕒 Ingresa el número de periodos (máximo {plazoMaximo}{" "}
            {modalidadPago.toLowerCase()}):
          </p>
          <input
            type="number"
            value={plazo}
            onChange={handlePlazoChange}
            min="1"
            max={plazoMaximo}
          />
          <p>📅 Elige la modalidad de pago que prefieras:</p>
          <select value={modalidadPago} onChange={handleModalidadChange}>
            {cultivos[cultivoSeleccionado].modalidades.map(
              (modalidad, index) => (
                <option key={index} value={modalidad}>
                  {modalidad}
                </option>
              )
            )}
          </select>
          <div>
            <p>Tasa FNG: {(fngRate * 100).toFixed(2)}%</p>
            <input
              type="number"
              value={fngRate}
              onChange={(e) => setFngRate(parseFloat(e.target.value))}
              step="0.0001"
              min="0"
              max="1"
            />
          </div>
          <div>
            <p>Tasa Ley Mipyme: {(mipymeRate * 100).toFixed(2)}%</p>
            <input
              type="number"
              value={mipymeRate}
              onChange={(e) => setMipymeRate(parseFloat(e.target.value))}
              step="0.0001"
              min="0"
              max="1"
            />
          </div>
          <div>
            <p>Tasa de Interés (M.V.): {(interestRate * 100).toFixed(2)}%</p>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              step="0.0001"
              min="0"
              max="1"
            />
          </div>
          <button onClick={handleCalcular}>Calcular Amortización</button>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {amortizacion.length > 0 && (
        <div className="chat-message">
          <h2>📊 Tabla de Amortización</h2>
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Cuota</th>
                <th>Cuota Constante</th>
                <th>Capital</th>
                <th>Interés</th>
                <th>FNG</th>
                <th>Ley Mipyme</th>
                <th>Cuota Total</th>
                <th>Saldo Restante</th>
              </tr>
            </thead>
            <tbody>
              {amortizacion.map((cuota, index) => (
                <tr key={index}>
                  <td>{cuota.cuota}</td>
                  <td>
                    {parseFloat(cuota.cuotaConstante).toLocaleString("es-CO")}
                  </td>
                  <td>
                    {parseFloat(cuota.capitalCuota).toLocaleString("es-CO")}
                  </td>
                  <td>
                    {parseFloat(cuota.interesCuota).toLocaleString("es-CO")}
                  </td>
                  <td>{parseFloat(cuota.fngCuota).toLocaleString("es-CO")}</td>
                  <td>
                    {parseFloat(cuota.mipymeCuota).toLocaleString("es-CO")}
                  </td>
                  <td>
                    {parseFloat(cuota.cuotaTotal).toLocaleString("es-CO")}
                  </td>
                  <td>
                    {parseFloat(cuota.saldoRestante).toLocaleString("es-CO")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="button-container">
            <button onClick={handleCalcular}>Recalcular</button>
            <button onClick={handleReiniciar}>Reiniciar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
