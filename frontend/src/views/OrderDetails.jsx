/*
Estructura de datos esperada para la variable 'order' que se obtiene de la API:
{
  "id": 12345,
  "status": "En Proceso",
  "creationDate": "2023-10-27T10:00:00Z",
  "doctor": {
    "name": "Dr. Juan Perez",
    "clinic": "Clínica Dental Sonrisa"
  },
  "patient": {
    "name": "Maria Lopez",
    "dni": "12345678X"
  },
  "technicalDetails": {
    "prosthesisType": "Corona de Porcelana",
    "measurements": "Modelo de yeso y registro de mordida",
    "material": "Zirconio",
    "resinType": "Acrílico Termocurable",
    "pathology": "Bruxismo",
    "urgency": "Normal",
    "observations": "Asegurar color A3"
  },
  "billing": {
    "invoiceId": "FAC-0001-2023",
    "paymentStatus": "Pagado",
    "totalAmount": 550.00,
    "items": [
      {
        "name": "Corona de Porcelana",
        "price": 500.00
      },
      {
        "name": "Envío Express",
        "price": 50.00
      }
    ]
  },
   "statusHistory": [
    { "status": "Creado", 
     "date": "2023-10-27T10:00:00Z", 
     "responsible": "Dr. Juan Perez" }
   ]
}
*/

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/OrderDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserDoctor, 
  faUserInjured, 
  faGear,
  faCrown,
  faRuler,
  faGem,
  faFlask,
  faStethoscope,
  faFireFlameCurved,
  faHourglassHalf,
  faFileInvoiceDollar,
  faCheckCircle,
  faChevronRight,
  faFile,
  faCube
} from '@fortawesome/free-solid-svg-icons';

const API_URL = "http://localhost:8000/api";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams(); 

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los detalles del pedido');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <div className="order-detail-container">Cargando detalles del pedido...</div>;
  }

  if (error) {
    return <div className="order-detail-container">Error: {error}</div>;
  }

  if (!order) {
    return <div className="order-detail-container">No se encontró el pedido.</div>;
  }
  
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="order-detail-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="breadcrumb-content">
            <Link to="/dashboard" className="breadcrumb-link">
              <FontAwesomeIcon icon={faFile} style={{marginRight: '8px'}} />
              Pedidos
            </Link>
            <FontAwesomeIcon icon={faChevronRight} style={{fontSize: '12px', margin: '0 8px'}} />
            <span className="breadcrumb-current">Pedido #{order.id}</span>
        </div>
      </div>

      {/* Order Header */}
      <div className="order-header-card">
        <div className="order-header-content">
          <div className="order-title-section">
            <h1 className="order-title">
              Pedido #{order.id}
              <span className={`status-badge status-${order.status.toLowerCase()}`}>
                <FontAwesomeIcon icon={faHourglassHalf} style={{marginRight: '6px'}} />
                {order.status}
              </span>
            </h1>
            <p className="order-date">Fecha del pedido: {formatDate(order.creationDate)}</p>
          </div>
        </div>
        
        <div className="order-info-grid">
          <div className="info-item">
            <p className="info-label">
              <FontAwesomeIcon icon={faUserDoctor} style={{marginRight: '8px'}} />
              Doctor Responsable
            </p>
            <p className="info-value">{order.doctor.name} ({order.doctor.clinic})</p>
          </div>
          <div className="info-item">
            <p className="info-label">
              <FontAwesomeIcon icon={faUserInjured} style={{marginRight: '8px'}} />
              Paciente
            </p>
            <p className="info-value">{order.patient.name} (DNI: {order.patient.dni})</p>
          </div>
        </div>
      </div>

      {/* Detalles Tecnicos*/}
      <div className="details-card">
        <h2 className="details-title">Detalles Técnicos</h2>
        <div className="details-grid">
          <div className="detail-item">
            <p className="detail-label">
              <FontAwesomeIcon icon={faGear} style={{marginRight: '8px'}} />
              Tipo de Prótesis
            </p>
            <p className="detail-value">{order.technicalDetails.prosthesisType}</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">
              <FontAwesomeIcon icon={faRuler} style={{marginRight: '8px'}} />
              Medidas
            </p>
            <p className="detail-value">{order.technicalDetails.measurements}</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">
              <FontAwesomeIcon icon={faGem} style={{marginRight: '8px'}} />
              Material Recomendado
            </p>
            <p className="detail-value">{order.technicalDetails.material}</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">
              <FontAwesomeIcon icon={faFlask} style={{marginRight: '8px'}} />
              Tipo de Resina
            </p>
            <p className="detail-value">{order.technicalDetails.resinType}</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">
              <FontAwesomeIcon icon={faStethoscope} style={{marginRight: '8px'}} />
              Patología
            </p>
            <p className="detail-value">{order.technicalDetails.pathology}</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">Urgencia</p>
            <div className="urgency-indicator">
              <FontAwesomeIcon icon={faFireFlameCurved} className={`urgency-icon ${order.technicalDetails.urgency.toLowerCase()}`} />
              <p className="urgency-text">{order.technicalDetails.urgency}</p>
            </div>
          </div>
          <div className="detail-item full-width">
            <p className="detail-label">Observaciones</p>
            <p className="detail-value">{order.technicalDetails.observations}</p>
          </div>
        </div>
      </div>

      {/* Historial
      <div className="details-card">
        <h2 className="details-title">Historial de Estados</h2>
        <div className="timeline-container">
          <ol className="timeline">
            {order.statusHistory.map((item, index) => (
              <li key={index} className="timeline-item">
                <span className={`timeline-icon status-${item.status.toLowerCase().replace(' ', '-')}`}>
                  <FontAwesomeIcon icon={faFileCirclePlus} className="timeline-icon-symbol" />
                </span>
                <div className="timeline-content">
                  <h3 className="timeline-event">{item.status}</h3>
                  <time className="timeline-date">{formatDate(item.date)} ({item.responsible})</time>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      */}
      
      
      {/* Facturacion*/}
      <div className="details-card">
        <h2 className="details-title">
          <FontAwesomeIcon icon={faFileInvoiceDollar} style={{marginRight: '12px'}} />
          Facturación
        </h2>
        <div className="billing-content">
          <div className="billing-header">
            <div className="billing-info">
              <p className="billing-text">Factura Asociada: <a className="billing-link" href="#">{order.billing.invoiceId}</a></p>
              <p className="billing-text">
                Estado del Pago: 
                <span className={`payment-status ${order.billing.paymentStatus.toLowerCase()}`}>
                  <FontAwesomeIcon icon={faCheckCircle} style={{marginRight: '6px'}} />
                  {order.billing.paymentStatus}
                </span>
              </p>
            </div>
            <div className="billing-total">
              <p className="total-amount">Monto Total: ${order.billing.totalAmount.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="table-container billing-table">
            <table className="inventory-table">
              <thead className="table-header">
                <tr>
                  <th scope="col">Ítem</th>
                  <th scope="col" className="text-right">Precio</th>
                </tr>
              </thead>
              <tbody>
                {order.billing.items.map((item, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-data primary">
                      <FontAwesomeIcon icon={item.name.includes('Corona') ? faCrown : faCube} style={{marginRight: '8px'}} />
                      {item.name}
                    </td>
                    <td className="table-data muted text-right">${item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
