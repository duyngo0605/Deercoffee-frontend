# README: DeerCoffee Application

## Overview
DeerCoffee is a Coffee Shop Management System designed to streamline operations for small to medium-sized coffee shops. The application includes functionalities such as order management, inventory tracking, employee scheduling, and reporting to improve efficiency and enhance customer experiences.

## Project Structure
The project consists of two main components:

- **Front-end**: Built with ReactJS to provide an intuitive user interface for administrators and staff.
- **Back-end**: Powered by Node.js and MongoDB to handle server-side logic and database management.

---

## Front-end

### Technologies Used
- **ReactJS**: For building the user interface.
- **Axios**: For API communication.
- **CSS Modules**: For styling components.
- **React Router**: For navigation.

### Features
1. **User Authentication**:
   - Secure login and logout using JWT.
   - Role-based navigation (Admin/Staff).

2. **Order Management**:
   - Create, update, and cancel orders.
   - Apply vouchers during checkout.

3. **Menu Management** (Admin only):
   - Add, edit, and delete menu items.

4. **Employee Management** (Admin only):
   - Manage employee profiles and schedules.

5. **Reports** (Admin only):
   - View sales reports and performance statistics.

### Setup Instructions
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open the application in your browser at `http://localhost:3000`.

### Directory Structure
```
frontend/
├── public/
├── src/
   ├── components/  # Reusable React components
   ├── pages/       # Page-level components
   ├── services/    # API calls
   ├── styles/      # CSS Modules
   ├── App.js      # Root component
   └── index.js    # Entry point
```

## Future Development
- Online ordering system.
- Customer analytics and trends.
- Integration with payroll systems for automated salary calculations.

## Contributors
- **Ngô Vũ Đức Duy**

## License
This project is licensed under the MIT License. See the LICENSE file for details.

