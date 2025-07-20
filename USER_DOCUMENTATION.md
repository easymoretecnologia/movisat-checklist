# User Documentation - Next Movisat Fleet Management System

## Overview
Next Movisat is a comprehensive fleet management system designed to streamline vehicle inspections, maintenance tracking, and fleet oversight. The system serves companies that manage vehicle fleets and need to ensure compliance with safety and maintenance standards.

## System Access & Authentication

### Login Process
1. Navigate to the system login page
2. Enter your registered email address
3. Enter your password
4. Click "Sign In" to access the system

### Account Types & Password Security
- All passwords are securely encrypted using industry-standard hashing
- Sessions are valid for 3 days before requiring re-authentication
- Contact your system administrator if you forget your password

## User Roles & Permissions

The system operates with three distinct user roles, each with specific permissions and access levels:

### 1. Administrator (Super User)
**Access Level**: Complete System Control

**Permissions:**
- **User Management**: Create, edit, delete, and manage all user accounts
- **Company Management**: Add, modify, and remove company records
- **Vehicle Management**: Complete vehicle fleet oversight and configuration
- **System Reports**: Access to all reporting and analytics features
- **Checklist Oversight**: View and manage all inspection checklists across companies
- **Data Management**: Perform data cleanup and maintenance operations
- **System Configuration**: Modify system settings and configurations

**Typical Use Cases:**
- System setup and configuration
- Multi-company management
- User account administration
- System-wide reporting and analytics
- Data maintenance and cleanup

### 2. Supervisor (Company Manager)
**Access Level**: Company-Scoped Management

**Permissions:**
- **Reminder Management**: Create, edit, and manage maintenance reminders
- **Notification Management**: Handle system notifications and alerts
- **Incident Tracking**: Monitor and manage incident reports
- **Non-Compliance Reports**: Track and address compliance issues
- **Company Data Access**: View data only within their assigned company
- **Driver Oversight**: Monitor drivers and vehicles within their company

**Typical Use Cases:**
- Fleet supervision within a company
- Maintenance scheduling and reminders
- Incident and compliance management
- Driver performance monitoring
- Company-specific reporting

### 3. Driver (Vehicle Operator)
**Access Level**: Personal Vehicle Management

**Permissions:**
- **Vehicle Access**: View and interact only with assigned vehicles
- **Checklist Execution**: Perform daily, weekly, and monthly inspections
- **Profile Management**: Update personal information and settings
- **Inspection History**: View personal inspection history

**Typical Use Cases:**
- Daily vehicle inspections
- Maintenance checklist completion
- Incident reporting
- Personal profile management

## Core Functionalities

### Vehicle Inspection System

#### Daily Checklists
**Purpose**: Essential safety checks performed before vehicle operation

**Inspection Items:**
- **Headlights (Faróis)**: Check functionality and alignment
- **Body/Exterior (Lataria)**: Inspect for damage, dents, or scratches
- **Windows (Vidros)**: Verify visibility and check for cracks
- **Odometer (Hodômetro)**: Record current mileage
- **Fuel Level (Combustível)**: Check fuel gauge and level
- **Water/Coolant (Água)**: Verify coolant levels
- **Lights (Luzes)**: Test all vehicle lighting systems

**Process:**
1. Select your assigned vehicle
2. Take a driver selfie for verification
3. Inspect each item and mark as "OK" or "Not OK"
4. Add observations for any issues found
5. Attach photos if necessary
6. Submit the checklist to complete inspection

#### Weekly Checklists
**Purpose**: Maintenance-focused inspections for ongoing vehicle health

**Inspection Items:**
- **Engine Oil (Óleo do Motor)**: Check oil level and condition
- **Windshield Washer Fluid (Água do Limpador)**: Verify fluid levels
- **Brake Fluid (Óleo de Freio)**: Check brake system fluid
- **Tires (Pneus)**: Inspect tire condition, pressure, and tread
- **Exhaust System (Escapamento)**: Check for damage or leaks
- **Windows (Vidros)**: Detailed window inspection
- **Lighting Systems (Luzes)**: Comprehensive light system check

#### Monthly Checklists
**Purpose**: Comprehensive interior and detailed vehicle inspection

**Inspection Items:**
- **Upholstery (Estofados)**: Inspect seat condition and cleanliness
- **Documentation (Documentação)**: Verify all required vehicle documents
- **Steering Wheel (Volante)**: Check steering functionality and condition
- **Transmission (Câmbio)**: Test gear shifting and transmission operation
- **Interior Hygiene (Higiene Interna)**: Assess overall cleanliness
- **Trunk (Porta-malas)**: Inspect cargo area condition
- **Battery (Bateria)**: Check battery condition and connections
- **Headlights (Faróis)**: Detailed headlight inspection

### Inspection Workflow

#### For Drivers:
1. **Vehicle Selection**: Choose your assigned vehicle from the dashboard
2. **Checklist Type**: System automatically determines due checklist type
3. **Self-Verification**: Take a selfie to verify identity
4. **Item Inspection**: Go through each inspection item systematically
5. **Documentation**: 
   - Mark each item as "OK" or "Not OK"
   - Add detailed observations for any issues
   - Attach photos for visual documentation
6. **Acknowledgment**: Confirm awareness of any non-compliance issues
7. **Submission**: Complete and submit the checklist

#### For Supervisors:
1. **Dashboard Overview**: View all pending and completed inspections
2. **Incident Monitoring**: Track vehicles with reported issues
3. **Compliance Tracking**: Monitor non-compliance patterns
4. **Reminder Management**: Set up maintenance reminders
5. **Reporting**: Generate compliance and incident reports

### Reminder System

#### Creating Reminders (Supervisors)
- **Title**: Brief description of the reminder
- **Description**: Detailed information about the task
- **Date & Time**: When the reminder should trigger
- **Assignment**: Assign to specific drivers or all drivers

#### Reminder Types:
- Maintenance schedules
- Documentation renewals
- Safety training reminders
- Inspection due dates
- Custom operational reminders

### Notification System

#### Automatic Notifications:
- Overdue inspections
- Non-compliance alerts
- System updates
- Maintenance reminders

#### Notification Management:
- Mark notifications as read
- Priority levels for different alert types
- Company-wide or individual notifications

### Incident & Compliance Tracking

#### Incident Reports (Ocorrências):
- Automatically generated from failed checklist items
- Track resolution status
- Photo documentation
- Driver and supervisor comments

#### Non-Compliance Reports (Inconformidades):
- Systematic tracking of safety violations
- Compliance trend analysis
- Corrective action tracking
- Regulatory reporting support

## Dashboard Features

### Driver Dashboard:
- **Assigned Vehicles**: Quick access to your vehicles
- **Pending Inspections**: Outstanding checklist requirements
- **Recent Activity**: Your recent inspection history
- **Notifications**: Personal alerts and reminders

### Supervisor Dashboard:
- **Fleet Overview**: Status of all company vehicles
- **Daily Reminders**: Today's scheduled tasks and alerts
- **Recent Notifications**: Company-wide and system notifications
- **Compliance Metrics**: Key performance indicators
- **Incident Summary**: Current open incidents

### Administrator Dashboard:
- **System Statistics**: Overall system usage and health
- **Multi-Company Overview**: Cross-company performance metrics
- **User Activity**: System-wide user engagement
- **System Health**: Technical system status

## Data Export & Reporting

### Available Exports:
- **Checklist Data**: Complete inspection records in CSV format
- **Compliance Reports**: Non-compliance tracking and trends
- **Incident Reports**: Detailed incident documentation
- **User Activity**: System usage and performance reports

### Report Filtering:
- Date ranges
- Vehicle types
- Company boundaries
- User roles
- Inspection types
- Compliance status

## File Management

### Image Uploads:
- **Supported Formats**: JPG, PNG, GIF
- **Size Limits**: Optimized for mobile device uploads
- **Storage**: Secure cloud storage with backup
- **Access**: Role-based access to uploaded images

### Document Management:
- Vehicle documentation storage
- Inspection photo archives
- Compliance document tracking
- Export capabilities for records

## Mobile Accessibility

### Responsive Design:
- Optimized for smartphones and tablets
- Touch-friendly interface
- Mobile camera integration
- Offline capability for inspections

### Mobile Features:
- **Camera Integration**: Direct photo capture for inspections
- **GPS Integration**: Location tracking for inspections
- **Offline Mode**: Complete inspections without internet connection
- **Sync Capability**: Automatic data synchronization when online

## Security Features

### Data Protection:
- **Encryption**: All data encrypted in transit and at rest
- **Access Control**: Role-based permissions and company boundaries
- **Audit Trail**: Complete tracking of user actions
- **Backup Systems**: Regular automated backups

### User Security:
- **Password Requirements**: Strong password enforcement
- **Session Management**: Automatic timeout for security
- **Multi-Device Support**: Secure access from multiple devices
- **Account Lockout**: Protection against unauthorized access attempts

## Best Practices

### For Drivers:
1. **Daily Routine**: Perform inspections before vehicle operation
2. **Thorough Documentation**: Take clear photos and detailed notes
3. **Honest Reporting**: Report all issues, no matter how minor
4. **Regular Updates**: Keep personal information current
5. **Safety First**: Never operate an unsafe vehicle

### For Supervisors:
1. **Regular Monitoring**: Check dashboards daily for alerts
2. **Proactive Reminders**: Set up maintenance schedules in advance
3. **Quick Response**: Address non-compliance issues promptly
4. **Documentation**: Maintain detailed records of corrective actions
5. **Communication**: Keep drivers informed of policy changes

### For Administrators:
1. **User Training**: Ensure all users understand their roles
2. **Regular Backups**: Maintain system and data backups
3. **Security Updates**: Keep system security current
4. **Performance Monitoring**: Track system performance metrics
5. **Documentation**: Maintain current system documentation

## Troubleshooting

### Common Issues:

#### Login Problems:
- Verify email address spelling
- Check password case sensitivity
- Clear browser cache and cookies
- Contact administrator for password reset

#### Photo Upload Issues:
- Check internet connection
- Verify image file size (should be reasonable)
- Try different image format
- Refresh page and retry

#### Checklist Submission Failures:
- Ensure all required fields are completed
- Check internet connectivity
- Save draft and retry later
- Contact supervisor if issues persist

#### Performance Issues:
- Close unnecessary browser tabs
- Clear browser cache
- Check internet speed
- Try different browser

### Support Contact:
- Contact your system administrator for technical issues
- Supervisors can assist with operational questions
- Refer to this documentation for standard procedures
- Report bugs or system improvements to technical support

## Training & Onboarding

### New User Setup:
1. Account creation by administrator
2. Role assignment and permissions setup
3. Initial login and password change
4. Dashboard familiarization
5. First inspection walkthrough

### Ongoing Training:
- Regular system updates and feature announcements
- Best practice sharing sessions
- Compliance training updates
- Safety procedure reviews

## System Updates

### Version Updates:
- Automatic system updates with minimal downtime
- Feature announcements via notifications
- Training materials updated with new features
- Backward compatibility maintained

### User Communication:
- System maintenance notifications
- New feature announcements
- Policy changes and updates
- Security update notifications