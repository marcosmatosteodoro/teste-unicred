import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCooperado, deleteCooperado } from '../../store/slices/cooperadosSlice';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LayoutContext } from '../../context/LayoutContext';
import useFormatters from '../../hooks/useFormatters';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import NotFoundPage from '../../components/NotFoundPage';
import { texto } from '../../data/texts';

const CooperadoView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current, status, error } = useSelector(state => state.cooperados);
  const { setLayoutData } = useContext(LayoutContext);
  const { formatDocument, formatDate, formatCurrency } = useFormatters();

  useEffect(() => {
    dispatch(fetchCooperado(id));
  }, [dispatch, id]);

  useEffect(() => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: '/cooperados', label: 'Cooperados' }, 
        { path: `/cooperados/${id}`, label: current?.nome || 'Detalhes' }
      ],
      title: current?.nome ? `Detalhes: ${current.nome}` : 'Detalhes do Cooperado',
      icon: 'bi-person-badge',
      buttons: (
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" to={`/cooperados/${id}/editar`}>
            <i className="bi bi-pencil-square me-2"></i>Editar
          </Link>
          <button 
            onClick={() => handleDelete(current.id)}
            className="btn btn-danger"
          >
            <i className="bi bi-trash me-2"></i>Excluir
          </button>
          <Link className="btn btn-outline-secondary" to="/cooperados">
            <i className="bi bi-arrow-left me-2"></i>Voltar
          </Link>
        </div>
      )
    }));
  }, [setLayoutData, current, id]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente excluir este cooperado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    }).then( async (result) => {
      if (result.isConfirmed) {
        dispatch(deleteCooperado(id));
        Swal.fire('Excluído!', 'O cooperado foi excluído.', 'success')
          .then(() => {
            navigate('/cooperados/');
          });
      }
    });
  };

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (!current) return <NotFoundPage message="Cooperado não encontrado" />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <h5 className="text-muted mb-3">
                <i className="bi bi-file-text me-2"></i>
                Informações Básicas
              </h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="fw-bold">{texto[current.tipo_pessoa].nome }:</span>
                  <span>{current.nome}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Tipo:</span>
                  <span>{current.tipo_pessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="fw-bold">{texto[current.tipo_pessoa].documento }:</span>
                  <span>{formatDocument(current.documento, current.tipo_pessoa)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="fw-bold">{texto[current.tipo_pessoa].data }:</span>
                  <span>{formatDate(current.data)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="fw-bold">{texto[current.tipo_pessoa].valor }:</span>
                  <span>{formatCurrency(current.valor)}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <h5 className="text-muted mb-3">
                <i className="bi bi-telephone me-2"></i>
                Contato
              </h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Telefone:</span>
                  <span>{current.codigo_pais} {current.telefone}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Email:</span>
                  <a href={`mailto:${current.email}`} className="text-decoration-none">
                    {current.email}
                  </a>
                </li>
              </ul>
            </div>
            
            {current.observacoes && (
              <div className="mb-3">
                <h5 className="text-muted mb-3">
                  <i className="bi bi-chat-square-text me-2"></i>
                  Observações
                </h5>
                <div className="card">
                  <div className="card-body">
                    <p className="card-text">{current.observacoes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        

      </div>
    </div>
  );
};

export default CooperadoView;