# Guía de Integración con Stripe Checkout

## 📋 Resumen

Esta guía explica cómo integrar **Stripe Checkout** para procesar pagos reales con montos dinámicos basados en el carrito de compras.

---

## 🔧 Configuración Actual

Actualmente, la aplicación:
- ✅ Crea órdenes en el backend
- ✅ Genera PDFs de recibos
- ✅ Limpia el carrito después de la compra
- ❌ **NO procesa pagos reales con Stripe**

---

## 🚀 Implementación de Stripe Checkout

### Paso 1: Instalar Stripe en el Backend (NestJS)

```bash
npm install stripe @nestjs/stripe
```

### Paso 2: Configurar Stripe en el Backend

**2.1. Crear módulo de pagos**

```bash
nest g module payments
nest g service payments
nest g resolver payments
```

**2.2. Configurar variables de entorno (.env)**

```env
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui
FRONTEND_URL=http://localhost:5173
```

**2.3. Crear servicio de pagos (payments.service.ts)**

```typescript
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY'),
      { apiVersion: '2023-10-16' }
    );
  }

  async createCheckoutSession(ordenId: string, items: any[], total: number) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.producto.nombre,
            images: item.producto.imagen_url ? [item.producto.imagen_url] : [],
          },
          unit_amount: Math.round(item.precioUnitario * 100), // Stripe usa centavos
        },
        quantity: item.cantidad,
      })),
      mode: 'payment',
      success_url: `${this.configService.get('FRONTEND_URL')}/purchase-success?session_id={CHECKOUT_SESSION_ID}&orden_id=${ordenId}`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/purchase-cancel?orden_id=${ordenId}`,
      metadata: {
        ordenId,
      },
    });

    return session;
  }

  async verifyPayment(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    return session;
  }
}
```

**2.4. Crear resolver GraphQL (payments.resolver.ts)**

```typescript
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';

@Resolver()
export class PaymentsResolver {
  constructor(private paymentsService: PaymentsService) {}

  @Mutation(() => String)
  async crearCheckoutSession(
    @Args('ordenId') ordenId: string,
    @Args('items', { type: () => [OrderItemInput] }) items: any[],
    @Args('total') total: number,
  ) {
    const session = await this.paymentsService.createCheckoutSession(
      ordenId,
      items,
      total,
    );
    return session.url; // Retorna la URL de checkout
  }

  @Query(() => Boolean)
  async verificarPago(@Args('sessionId') sessionId: string) {
    const session = await this.paymentsService.verifyPayment(sessionId);
    return session.payment_status === 'paid';
  }
}
```

### Paso 3: Actualizar Frontend

**3.1. Crear mutation GraphQL (payments.queries.js)**

```javascript
import { gql } from '@apollo/client';

export const CREAR_CHECKOUT_SESSION = gql`
  mutation CrearCheckoutSession(
    $ordenId: ID!
    $items: [OrderItemInput!]!
    $total: Float!
  ) {
    crearCheckoutSession(ordenId: $ordenId, items: $items, total: $total)
  }
`;

export const VERIFICAR_PAGO = gql`
  query VerificarPago($sessionId: String!) {
    verificarPago(sessionId: $sessionId)
  }
`;
```

**3.2. Crear hook (usePayments.js)**

```javascript
import { useMutation, useQuery } from '@apollo/client';
import { CREAR_CHECKOUT_SESSION, VERIFICAR_PAGO } from '../services/graphql/payments.queries';

export const usePayments = () => {
  const [crearCheckoutMutation] = useMutation(CREAR_CHECKOUT_SESSION);

  const crearCheckoutSession = async (ordenId, items, total) => {
    const result = await crearCheckoutMutation({
      variables: { ordenId, items, total },
    });
    return result.data.crearCheckoutSession; // URL de checkout
  };

  return {
    crearCheckoutSession,
  };
};

export const useVerificarPago = (sessionId) => {
  const { data, loading, error } = useQuery(VERIFICAR_PAGO, {
    variables: { sessionId },
    skip: !sessionId,
  });

  return {
    pagado: data?.verificarPago || false,
    loading,
    error,
  };
};
```

**3.3. Actualizar CartModal.jsx**

```jsx
import { usePayments } from '../../../hooks/usePayments';

const CartModal = ({ onClose }) => {
  const { crearCheckoutSession } = usePayments();
  
  const handlePurchase = async () => {
    try {
      const orden = await crearOrden(items);
      
      // Crear sesión de checkout en Stripe
      const checkoutUrl = await crearCheckoutSession(
        orden.id,
        carrito.items,
        carrito.total
      );
      
      // Redirigir a Stripe Checkout
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar la compra");
    }
  };
};
```

**3.4. Crear páginas de éxito y cancelación**

```jsx
// PurchaseSuccess.jsx
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVerificarPago } from '../hooks/usePayments';

const PurchaseSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const ordenId = searchParams.get('orden_id');
  
  const { pagado, loading } = useVerificarPago(sessionId);
  
  if (loading) return <Spin size="large" />;
  
  return (
    <div>
      {pagado ? (
        <>
          <h1>✅ ¡Pago Exitoso!</h1>
          <p>Tu orden {ordenId} ha sido procesada correctamente.</p>
        </>
      ) : (
        <>
          <h1>❌ Pago Pendiente</h1>
          <p>El pago aún no se ha confirmado.</p>
        </>
      )}
    </div>
  );
};
```

---

## 🧪 Cómo Probar Stripe en Modo Test

### Obtener Claves de API

1. Ir a https://dashboard.stripe.com/test/apikeys
2. Copiar:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### Tarjetas de Prueba

- **Pago exitoso**: `4242 4242 4242 4242`
- **Pago rechazado**: `4000 0000 0000 0002`
- **Requiere autenticación 3D Secure**: `4000 0025 0000 3155`

**Fecha de expiración**: Cualquier fecha futura
**CVV**: Cualquier 3 dígitos
**ZIP**: Cualquier código postal

---

## 📊 Flujo Completo

```
Usuario → Agregar al Carrito → Ver Carrito → Procesar Compra
    ↓
Backend: Crear Orden en BD
    ↓
Backend: Crear Sesión de Stripe Checkout
    ↓
Frontend: Redirigir a Stripe (URL de checkout)
    ↓
Usuario: Ingresa datos de tarjeta en Stripe
    ↓
Stripe: Procesa el pago
    ↓
Stripe: Redirige a success_url o cancel_url
    ↓
Frontend: Verifica el pago con backend
    ↓
Backend: Actualiza estado de orden a "PAGADA"
    ↓
Frontend: Muestra recibo y confirma compra
```

---

## 🔒 Seguridad

1. **Nunca expongas tu `STRIPE_SECRET_KEY`** en el frontend
2. **Usa webhooks** para confirmar pagos (más seguro que solo verificar en el frontend)
3. **Valida montos** en el backend antes de crear la sesión de checkout
4. **Verifica firmas** de webhooks con `STRIPE_WEBHOOK_SECRET`

---

## 📚 Recursos Adicionales

- [Stripe Checkout Docs](https://stripe.com/docs/checkout/quickstart)
- [Stripe with NestJS](https://docs.nestjs.com/recipes/stripe)
- [Stripe Testing Cards](https://stripe.com/docs/testing)
- [Webhook Events](https://stripe.com/docs/webhooks)

---

## ✅ Checklist de Implementación

- [ ] Instalar dependencias (`stripe`, `@nestjs/stripe`)
- [ ] Configurar variables de entorno
- [ ] Crear servicio de pagos en backend
- [ ] Crear resolver GraphQL para checkout
- [ ] Crear mutations/queries en frontend
- [ ] Actualizar CartModal con lógica de checkout
- [ ] Crear páginas de éxito/cancelación
- [ ] Probar con tarjetas de prueba
- [ ] Configurar webhooks (opcional pero recomendado)
- [ ] Implementar verificación de pagos

---

**Nota**: Esta es una implementación básica. Para producción, considera agregar:
- Manejo de errores más robusto
- Logs de transacciones
- Webhooks para eventos de Stripe
- Reintentos automáticos
- Notificaciones por email
