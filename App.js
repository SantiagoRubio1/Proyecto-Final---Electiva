import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    age: '',
    grade: '',
  });
  const [editStudent, setEditStudent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getStudents = async () => {
    try {
      const response = await axios.get('http://192.168.80.11:8080/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students', error);
    }
  };

  const openModal = (student = null) => {
    setEditStudent(student);
    if (student) {
      setNewStudent(student);
    } else {
      setNewStudent({ name: '', age: '', grade: '' });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditStudent(null);
  };

  const handleSave = async () => {
    if (editStudent) {
      await updateStudent();
    } else {
      await addStudent();
    }
  };

  const addStudent = async () => {
    try {
      const response = await axios.post('http://192.168.80.11:8080/students', newStudent);
      setStudents([...students, response.data]);
      closeModal();
    } catch (error) {
      console.error('Error adding student', error);
    }
  };

  const updateStudent = async () => {
    try {
      const response = await axios.put(`http://192.168.80.11:8080/students/${editStudent.id}`, newStudent);
      const updatedStudents = students.map((student) =>
        student.id === editStudent.id ? response.data : student
      );
      setStudents(updatedStudents);
      closeModal();
    } catch (error) {
      console.error('Error updating student', error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://192.168.80.11:8080/students/${id}`);
      const filteredStudents = students.filter((student) => student.id !== id);
      setStudents(filteredStudents);
    } catch (error) {
      console.error('Error deleting student', error);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Colegio</Text>
      {students.length === 0 ? (
        <Text style={styles.noStudentsText}>No hay estudiantes</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.studentItem}>
              <Text style={styles.studentText}>Nombre: {item.name}</Text>
              <Text style={styles.studentText}>Edad: {item.age} años</Text>
              <Text style={styles.studentText}>Grado: {item.grade}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={() => openModal(item)} style={styles.editButton}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteStudent(item.id)} style={styles.deleteButton}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.addButtonText}>Añadir estudiante</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editStudent ? 'Editar' : 'Añadir'} Estudiante</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={newStudent.name}
              onChangeText={(value) => setNewStudent({ ...newStudent, name: value })}
            />
            <TextInput
              style={styles.input}
              placeholder="Edad"
              value={newStudent.age}
              onChangeText={(value) => setNewStudent({ ...newStudent, age: value })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Grado"
              value={newStudent.grade}
              onChangeText={(value) => setNewStudent({ ...newStudent, grade: value })}
            />
            <View style={styles.modalButtons}>
              <Button title={editStudent ? 'Actualizar' : 'Añadir'} onPress={handleSave} />
              <Button title="Cancelar" onPress={closeModal} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34',
    padding: 20,
  },
  title: {
    marginTop: '10%',
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    color: '#28a745',
  },
  noStudentsText: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 20,
    color: '#f0f0f0',
  },
  studentItem: {
    backgroundColor: '#444c56',
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  studentText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#ffffff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  editButton: {
    backgroundColor: '#17a2b8',
    padding: 12,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 15,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#333940',
    padding: 30,
    borderRadius: 15,
    width: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#61dafb',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#61dafb',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    width: '100%',
    color: '#ffffff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
