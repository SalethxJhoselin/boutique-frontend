// src/api/graphql/mlQueries.js
import { gql } from '@apollo/client';

export const BUSQUEDA_VISUAL_QUERY = gql`
  query BusquedaVisual($imageBase64: String!, $limit: Int) {
    busquedaVisual(imageBase64: $imageBase64, limit: $limit) {
      product_id
      similarity_score
      matched_attributes
    }
  }
`;

export const CLASIFICAR_IMAGEN_MUTATION = gql`
  mutation ClasificarImagen($productId: String!, $imageBase64: String!) {
    clasificarImagen(productId: $productId, imageBase64: $imageBase64) {
      success
      product_id
      model_version
      processing_time_ms
      embedding_vector
      predictions {
        tipo_prenda {
          label
          confidence
        }
        tipo_cuello {
          label
          confidence
        }
        tipo_manga {
          label
          confidence
        }
        patron {
          label
          confidence
        }
        color_principal {
          label
          confidence
        }
        estilo {
          label
          confidence
        }
      }
    }
  }
`;
export const OBTENER_METRICAS_ML_QUERY = gql`
  query ObtenerMetricasML {
    obtenerMetricasML {
      total_images_processed
      total_products_indexed
      avg_classification_time_ms
      model_version
      model_accuracy
      uptime_hours
    }
  }
`;

export const BUSCAR_SIMILARES_POR_PRODUCTO_QUERY = gql`
  query BuscarSimilaresPorProducto($productId: String!, $limit: Int) {
    buscarSimilaresPorProducto(productId: $productId, limit: $limit) {
      product_id
      similarity_score
      matched_attributes
    }
  }
`;