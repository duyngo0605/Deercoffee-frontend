import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

export const EmployeeList = ({ employees }) => (
  <div className="employee-list">
    <h3>Danh sách nhân viên</h3>
    <Droppable droppableId="employees">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef} className="employee-droppable">
          {employees.map((employee, index) => (
            <Draggable key={employee._id} draggableId={employee._id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="employee-item"
                >
                  {employee.name}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
); 