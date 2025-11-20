import React, { useState, useEffect } from 'react';
import '../styles/PatientManagement.css';
import AddPatientModal from '../components/modals/AddPatientModal/AddPatientModal';
import ActionsMenu from '../components/ui/ActionsMenu/ActionsMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const PatientManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleOpenModal = (patient = null) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const allPatients = [
    { id: 'DT-001', name: 'Ana Torres', email: 'ana.torres@email.com', phone: '+34 600 123 456' },
    { id: 'DT-002', name: 'Carlos Gómez', email: 'carlos.gomez@email.com', phone: '+34 600 234 567' },
    { id: 'DT-003', name: 'Luisa Fernández', email: 'luisa.fernandez@email.com', phone: '+34 600 345 678' },
    { id: 'DT-004', name: 'Javier Ruiz', email: 'javier.ruiz@email.com', phone: '+34 600 456 789' },
    { id: 'DT-005', name: 'Sofía Navarro', email: 'sofia.navarro@email.com', phone: '+34 600 567 890' },
  ];

  useEffect(() => {
    const results = allPatients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(results);
  }, [searchTerm]);

  return (
    <div className="patient-management-container">
      <div className="page-header">
        <h1 className="page-title">Gestión de Pacientes</h1>
        <p className="page-subtitle">Administra la información de tus pacientes de forma centralizada.</p>
      </div>

      <div className="content-card">
        <div className="toolbar">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre o apellido..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="actions">
            <button className="icon-button" onClick={() => console.log('Abrir modal de filtros')}>
              <FontAwesomeIcon icon={faFilter} />
            </button>
            <button className="primary-button" onClick={() => handleOpenModal()}>
              <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: '8px' }} />
              Agregar Paciente
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="patient-table">
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>ID Paciente</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td className="text-muted">{patient.id}</td>
                  <td className="text-muted">{patient.email}</td>
                  <td className="text-muted">{patient.phone}</td>
                  <td className="text-right">
                    <ActionsMenu
                      onModify={() => handleOpenModal(patient)}
                      onDelete={() => console.log('Eliminar paciente:', patient.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span className="pagination-info">Mostrando 1 a 5 de 25 resultados</span>
          <div className="pagination-buttons">
            <button className="pagination-button">Anterior</button>
            <button className="pagination-button active">1</button>
            <button className="pagination-button">2</button>
            <button className="pagination-button">3</button>
            <button className="pagination-button">Siguiente</button>
          </div>
        </div>
      </div>
      <AddPatientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        patientData={selectedPatient}
      />
    </div>
  );
};

export default PatientManagement;
