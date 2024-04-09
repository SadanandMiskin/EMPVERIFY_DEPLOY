// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BGV {
    // Enum to represent document access control
    enum AccessType { CompanyOnly, StudentOnly, Both }

    // Struct to represent a document
    struct Document {
        string name;
        string hashValue;
        AccessType access;
    }

    // Struct to represent a student
    struct Student {
        string name;
        address studentAddress;
        address addedBy; // Address of the university that added the student
        mapping(string => Document) documents; // Mapping of hashValue to Document
        string[] documentKeys; // Array to store keys of documents mapping
    }

    // Struct to represent a university
    struct University {
        string name;
        address universityAddress;
        string licenseNumber;
        bool approvedByGovernment;
    }

        // Struct to represent a verifier
    struct Verifier {
        string organizationName;
        address verifierAddress;
    }

    // Mapping to store students by their Ethereum address
    mapping(address => Student) public students;

    // Mapping to store universities by their Ethereum address
    mapping(address => University) public universities;

    // Mapping to store license numbers to prevent duplicates
    mapping(string => bool) public licenseNumbers;

     // Mapping to store verifiers by their Ethereum address
    mapping(address => Verifier) public verifiers;

    // Array to store university addresses
    address[] public universityAddresses;

    // Array to store verifier addresses
    address[] public verifierAddresses;

    // Event to emit when a new student is added
    // event StudentAdded(address indexed studentAddress, string name, address indexed addedBy);

    // Event to emit when a new document is added to a student
    event DocumentAdded(address indexed studentAddress, string documentName, string hashValue, AccessType access);

    // Event to emit when a new university is added
    event UniversityAdded(address indexed universityAddress, string name);

    // Event to emit when document access type is changed
    event DocumentAccessChanged(address indexed studentAddress, string hashValue, AccessType newAccessType);

     // Event to emit when a new verifier is added
    event VerifierAdded(address indexed verifierAddress, string organizationName);

    // Modifier to ensure only a legitimate verifier can add themselves
    modifier onlyLegitimateVerifier(address _organizationAddress) {
        require(verifiers[msg.sender].verifierAddress == address(0), "Verifier already exists");
        _;
    }
    // Modifier to ensure only a legitimate university can add a student
    modifier onlyLegitimateUniversity(address _universityAddress) {
        require(universities[_universityAddress].approvedByGovernment && bytes(universities[_universityAddress].licenseNumber).length > 0, "Only a legitimate university can add a student");
        _;
    }

    // Function to add a new student
    // mapping(address => Student) public students;
    address[] public studentAddresses; // Maintain a list of student addresses

    // Function to add a new student
    function addStudent(string memory _name, address _studentAddress) public {
        // Ensure the student does not already exist
        require(students[_studentAddress].studentAddress == address(0), "Student already exists");

        // Create a new student
        Student storage newStudent = students[_studentAddress];
        newStudent.name = _name;
        newStudent.studentAddress = _studentAddress;
        newStudent.addedBy = msg.sender; // Set the university that added the student

        // Add the student address to the list
        studentAddresses.push(_studentAddress);

        // Emit an event to notify that a new student has been added
        emit StudentAdded(_studentAddress, _name, msg.sender);
    }

    // Function to get all students' names
    function getAllStudentNames() public view returns (string[] memory) {
        string[] memory names = new string[](studentAddresses.length);

        for (uint256 i = 0; i < studentAddresses.length; i++) {
            names[i] = students[studentAddresses[i]].name;
        }

        return names;
    }

    // Function to get all students' addresses
    function getAllStudentAddresses() public view returns (address[] memory) {
        return studentAddresses;
    }

    // Event to emit when a new student is added
    event StudentAdded(address indexed studentAddress, string name, address indexed addedBy);

    // Function to add a document to an existing student
    function addDocumentToStudent(address _studentAddress, string memory _documentName, string memory _hashValue, AccessType _access) public {
        // Ensure the student exists
        require(students[_studentAddress].studentAddress != address(0), "Student does not exist");

        // Ensure the caller is the university that added the student
        require(msg.sender == students[_studentAddress].addedBy, "Only the university that added the student can add documents");

        // Check if a document with the same hash value already exists
        require(students[_studentAddress].documents[_hashValue].access == AccessType(0), "Document already exists");

        // Create a new document
        Document memory newDocument = Document({
            name: _documentName,
            hashValue: _hashValue,
            access: _access
        });

        // Add the document to the student's mapping
        students[_studentAddress].documents[_hashValue] = newDocument;
        students[_studentAddress].documentKeys.push(_hashValue); // Add the key to documentKeys array

        // Emit an event to notify that a new document has been added to the student
        emit DocumentAdded(_studentAddress, _documentName, _hashValue, _access);
    }

    // Function to add a new university
    function addUniversity(string memory _name, address _universityAddress, string memory _licenseNumber, bool _approvedByGovernment) public {
        // Ensure the university address is unique
        require(universities[_universityAddress].universityAddress == address(0), "University address already exists");

        // Ensure the license number is unique
        require(!licenseNumbers[_licenseNumber], "License number already exists");

        // Ensure the university is approved by the government
        require(_approvedByGovernment, "University must be approved by the government");

        // Create a new university
        University storage newUniversity = universities[_universityAddress];
        newUniversity.name = _name;
        newUniversity.universityAddress = _universityAddress;
        newUniversity.licenseNumber = _licenseNumber;
        newUniversity.approvedByGovernment = _approvedByGovernment;

        // Add university address to the array
        universityAddresses.push(_universityAddress);

        // Mark the license number as used
        licenseNumbers[_licenseNumber] = true;

        // Emit an event to notify that a new university has been added
        emit UniversityAdded(_universityAddress, _name);
    }

    // Function to verify if a university is legitimate
    function isUniversityLegitimate(address _universityAddress) public view returns (bool) {
        return universities[_universityAddress].approvedByGovernment && bytes(universities[_universityAddress].licenseNumber).length > 0;
    }

    // Function to get the count of documents for a student
    function getDocumentCount(address _studentAddress) public view returns (uint) {
        return students[_studentAddress].documentKeys.length;
    }

    // Function to get the details of a document for a student
    function getDocumentDetails(address _studentAddress, string memory _hashValue) public view returns (string memory, string memory, AccessType) {
        Document memory doc = students[_studentAddress].documents[_hashValue];
        return (doc.name, doc.hashValue, doc.access);
    }

    // Function to change the access type of a document for a student
    function changeDocumentAccess(address _studentAddress, string memory _hashValue, AccessType _newAccessType) public {
        // Ensure the student exists
        require(students[_studentAddress].studentAddress != address(0), "Student does not exist");

        // Ensure the caller is the student who owns the document
        require(msg.sender == _studentAddress, "Only the student can change document access");

        // Ensure the document exists
        require(students[_studentAddress].documents[_hashValue].access != AccessType(0), "Document does not exist");

        // Update the document access type
        students[_studentAddress].documents[_hashValue].access = _newAccessType;

        // Emit an event to notify that document access has been changed
        emit DocumentAccessChanged(_studentAddress, _hashValue, _newAccessType);
    }

    // Function to get all universities added
    function getAllUniversities() public view returns (University[] memory) {
        University[] memory allUniversities = new University[](universityAddresses.length);
        for (uint i = 0; i < universityAddresses.length; i++) {
            allUniversities[i] = universities[universityAddresses[i]];
        }
        return allUniversities;
    }

     // Function to add a new verifier
    function addVerifier(string memory _organizationName) public onlyLegitimateVerifier(msg.sender) {
        
        require(verifiers[msg.sender].verifierAddress == address(0), "Verifier with this address already exists");
        // Create a new verifier
        Verifier storage newVerifier = verifiers[msg.sender];
        newVerifier.organizationName = _organizationName;
        newVerifier.verifierAddress = msg.sender;

        // Add verifier address to the array
        verifierAddresses.push(msg.sender);

        // Emit an event to notify that a new verifier has been added
        emit VerifierAdded(msg.sender, _organizationName);
    } 
}
