import { gql } from '@apollo/client';

// ============================================
// QUERIES PRINCIPALES
// ============================================

export const REPORTE_GENERAL = gql`
  query ReporteGeneral {
    reporteGeneral {
      ventas {
        totalVentas
        montoTotal
        promedioVenta
        ventasProcesadas
        ventasPendientes
        ventasCanceladas
      }
      inventario {
        totalProductos
        productosActivos
        productosInactivos
        productosSinStock
        productosBajoStock
        valorTotalInventario
      }
      productosMasVendidos {
        producto {
          id
          nombre
          precio
          imagen_url
        }
        cantidadVendida
        montoTotal
      }
      usuariosMasActivos {
        usuario {
          id
          nombre
          email
        }
        totalCompras
        montoTotal
      }
      productosBajoStock {
        producto {
          id
          nombre
          stock
        }
        stockActual
        stockMinimo
      }
    }
  }
`;

// ============================================
// QUERIES DE VENTAS
// ============================================

export const REPORTE_VENTAS = gql`
  query ReporteVentas($input: ReporteFechasInput) {
    reporteVentas(input: $input) {
      totalVentas
      montoTotal
      promedioVenta
      ventasProcesadas
      ventasPendientes
      ventasCanceladas
    }
  }
`;

export const VENTAS_DEL_DIA = gql`
  query VentasDelDia {
    ventasDelDia {
      totalVentas
      montoTotal
      promedioVenta
      ventasProcesadas
      ventasPendientes
      ventasCanceladas
    }
  }
`;

export const VENTAS_DEL_MES = gql`
  query VentasDelMes {
    ventasDelMes {
      totalVentas
      montoTotal
      promedioVenta
      ventasProcesadas
      ventasPendientes
      ventasCanceladas
    }
  }
`;

export const VENTAS_DEL_ANIO = gql`
  query VentasDelAnio {
    ventasDelAnio {
      totalVentas
      montoTotal
      promedioVenta
      ventasProcesadas
      ventasPendientes
      ventasCanceladas
    }
  }
`;

export const VENTAS_POR_FECHA = gql`
  query VentasPorFecha($input: ReporteFechasInput) {
    ventasPorFecha(input: $input) {
      fecha
      cantidadVentas
      montoTotal
    }
  }
`;

// ============================================
// QUERIES DE RANKINGS
// ============================================

export const PRODUCTOS_MAS_VENDIDOS = gql`
  query ProductosMasVendidos($input: TopProductosInput) {
    productosMasVendidos(input: $input) {
      producto {
        id
        nombre
        precio
        imagen_url
        stock
      }
      cantidadVendida
      montoTotal
    }
  }
`;

export const USUARIOS_MAS_ACTIVOS = gql`
  query UsuariosMasActivos($input: TopProductosInput) {
    usuariosMasActivos(input: $input) {
      usuario {
        id
        nombre
        email
      }
      totalCompras
      montoTotal
    }
  }
`;

// ============================================
// QUERIES DE INVENTARIO
// ============================================

export const REPORTE_INVENTARIO = gql`
  query ReporteInventario {
    reporteInventario {
      totalProductos
      productosActivos
      productosInactivos
      productosSinStock
      productosBajoStock
      valorTotalInventario
    }
  }
`;

export const PRODUCTOS_BAJO_STOCK = gql`
  query ProductosBajoStock($stockMinimo: Int) {
    productosBajoStock(stockMinimo: $stockMinimo) {
      producto {
        id
        nombre
        precio
        stock
        imagen_url
      }
      stockActual
      stockMinimo
    }
  }
`;
