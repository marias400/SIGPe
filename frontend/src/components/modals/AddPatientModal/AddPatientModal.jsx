import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AddPatientModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const AddPatientModal = ({ isOpen, onClose, patientData }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    dni: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (patientData) {
      setFormData({
        name: patientData.name.split(' ')[0],
        lastname: patientData.name.split(' ').slice(1).join(' '),
        dni: patientData.id,
        phone: patientData.phone,
        email: patientData.email,
      });
    } else {
      setFormData({ name: '', lastname: '', dni: '', phone: '', email: '' });
    }
  }, [patientData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { delay: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">{patientData ? 'Modificar Paciente' : 'Agregar Nuevo Paciente'}</h2>
              <button className="modal-close-button" onClick={onClose}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <form className="patient-form">
                <div className="form-group">
                  <label htmlFor="name">Nombre</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="lastname">Apellido</label>
                  <input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="dni">DNI</label>
                  <input type="text" id="dni" name="dni" value={formData.dni} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Número de Contacto</label>
                  <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={onClose}>Cancelar</button>
              <button className="primary-button-modal">{patientData ? 'Guardar Cambios' : 'Guardar Paciente'}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddPatientModal;
