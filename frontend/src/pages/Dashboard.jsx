import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  LogOut,
  X,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../services/api';

export default function Dashboard({ user, onLogout }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    course: '',
    phone: '',
  });
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch students
  const loadStudents = async (searchQuery = '') => {
    try {
      setLoading(true);
      const res = await getStudents(searchQuery);
      setStudents(res.data);
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents(search);
  }, [search]);

  const showNotification = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Open Modal for Create
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      rollNumber: '',
      email: '',
      course: '',
      phone: '',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (student) => {
    setEditingId(student._id);
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber,
      email: student.email,
      course: student.course,
      phone: student.phone,
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setModalError('');
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (modalError) setModalError('');
  };

  // Submit Add or Edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.rollNumber ||
      !formData.email ||
      !formData.course ||
      !formData.phone
    ) {
      setModalError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    setModalError('');

    try {
      if (editingId) {
        // Update existing student
        await updateStudent(editingId, formData);
        showNotification('success', 'Student details updated successfully!');
      } else {
        // Create new student
        await createStudent(formData);
        showNotification('success', 'New student added successfully!');
      }
      handleCloseModal();
      loadStudents(search);
    } catch (err) {
      setModalError(
        err.response?.data?.message || 'Operation failed. Please verify the details.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Student
  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirmed) return;

    try {
      await deleteStudent(id);
      showNotification('success', `Student ${name} deleted successfully.`);
      loadStudents(search);
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete student.');
    }
  };

  // Stats calculation
  const totalStudents = students.length;
  const uniqueCourses = new Set(students.map((s) => s.course.toLowerCase())).size;

  return (
    <div className="dashboard-layout">
      {/* Top Navigation */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="brand-icon">
              <GraduationCap size={20} />
            </div>
            <span>Student Management</span>
          </div>

          <div className="navbar-user">
            <div className="user-badge">
              <div className="user-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span>{user?.name || 'Administrator'}</span>
            </div>
            <button
              onClick={onLogout}
              className="btn btn-outline btn-sm"
              title="Logout"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content">
        {/* Global Feedback Banner */}
        {notification && (
          <div
            className={`alert ${
              notification.type === 'success' ? 'alert-success' : 'alert-error'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{notification.text}</span>
          </div>
        )}

        {/* Top Summary Cards */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Users size={24} />
            </div>
            <div>
              <div className="stat-label">Total Students</div>
              <div className="stat-value">{totalStudents}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="stat-label">Total Courses</div>
              <div className="stat-value">{uniqueCourses}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <GraduationCap size={24} />
            </div>
            <div>
              <div className="stat-label">Active Database</div>
              <div className="stat-value">Online</div>
            </div>
          </div>
        </section>

        {/* Content Card with Actions & Table */}
        <section className="content-card">
          <div className="card-header-bar">
            {/* Search Input */}
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, roll, course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Add New Student Button */}
            <button onClick={handleOpenAddModal} className="btn btn-primary">
              <Plus size={18} />
              <span>Add Student</span>
            </button>
          </div>

          {/* Student Table */}
          <div className="table-responsive">
            {loading ? (
              <div className="empty-state">Loading students record...</div>
            ) : students.length === 0 ? (
              <div className="empty-state">
                <Users size={40} />
                <p>No students found. Click "Add Student" to create a record.</p>
              </div>
            ) : (
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll No</th>
                    <th>Course</th>
                    <th>Contact</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <div className="student-cell">
                          <div className="student-avatar">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="student-info-name">
                              {student.name}
                            </div>
                            <div className="student-info-roll">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{student.rollNumber}</strong>
                      </td>
                      <td>
                        <span className="badge-course">{student.course}</span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                          <div>{student.phone}</div>
                        </div>
                      </td>
                      <td>
                        <div
                          className="table-actions"
                          style={{ justifyContent: 'flex-end' }}
                        >
                          <button
                            className="btn-icon edit"
                            title="Edit Student"
                            onClick={() => handleOpenEditModal(student)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="btn-icon delete"
                            title="Delete Student"
                            onClick={() =>
                              handleDelete(student._id, student.name)
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                {editingId ? 'Edit Student Details' : 'Add New Student'}
              </h2>
              <button
                className="modal-close"
                onClick={handleCloseModal}
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body">
              {modalError && (
                <div className="alert alert-error">
                  <AlertCircle size={18} />
                  <span>{modalError}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alex Johnson"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rollNumber">
                  Roll Number / Student ID
                </label>
                <input
                  id="rollNumber"
                  name="rollNumber"
                  type="text"
                  className="form-input"
                  placeholder="e.g. CS2026-001"
                  value={formData.rollNumber}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="e.g. alex@example.com"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="course">
                  Course / Department
                </label>
                <input
                  id="course"
                  name="course"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Computer Science"
                  value={formData.course}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className="form-input"
                  placeholder="e.g. +1 555-0192"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? 'Saving...'
                    : editingId
                    ? 'Update Student'
                    : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
