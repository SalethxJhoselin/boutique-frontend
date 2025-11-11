// services/kpisService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002/api/kpis'; // Ajusta según tu backend

class KpisService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Health check para verificar que el backend está funcionando
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error en health check:', error);
      throw error;
    }
  }

  // Obtener todo el dashboard completo
  async getDashboard() {
    try {
      const response = await this.client.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo dashboard:', error);
      throw error;
    }
  }

  // Obtener métricas de ventas con rango opcional
  async getVentasKPIs(rango = 'mes') {
    try {
      const response = await this.client.get('/ventas', {
        params: { rango }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo métricas de ventas:', error);
      throw error;
    }
  }

  // Obtener métricas de productos
  async getProductosKPIs() {
    try {
      const response = await this.client.get('/productos');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo métricas de productos:', error);
      throw error;
    }
  }

  // Obtener métricas de usuarios
  async getUsuariosKPIs() {
    try {
      const response = await this.client.get('/usuarios');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo métricas de usuarios:', error);
      throw error;
    }
  }

  // Obtener analíticas de Machine Learning
  async getAnaliticasML() {
    try {
      const response = await this.client.get('/ml-analytics');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo analíticas ML:', error);
      throw error;
    }
  }

  // Métodos específicos para ventas por rango
  async getVentasDiarias() {
    return this.getVentasKPIs('dia');
  }

  async getVentasSemanales() {
    return this.getVentasKPIs('semana');
  }

  async getVentasMensuales() {
    return this.getVentasKPIs('mes');
  }

  async getVentasAnuales() {
    return this.getVentasKPIs('anio');
  }
}

// Crear instancia única (Singleton)
const kpisService = new KpisService();

export default kpisService;