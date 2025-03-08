import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    styled,
    tableCellClasses,
} from "@mui/material";
import { useEffect, useState } from "react";



interface CustomerCategory {
    code: string;
    description: string;
}

interface CustomerListQuery {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  iban: string;
  customerCategory: CustomerCategory;
}


export default function CustomerListPage() {
    
    const [list, setList] = useState<CustomerListQuery[]>([]);
    const [searchText, setSearchText] = useState("");
    
    const fetchCustomers = (filter: string) => {
        fetch(`/api/customers/list?searchText=${encodeURIComponent(filter)}`)
          .then((response) => response.json())
          .then((data) => setList(data as CustomerListQuery[]))
          .catch((error) => console.error("Error fetching customers:", error));
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          fetchCustomers(searchText);
        }, 800);
    
        return () => clearTimeout(delayDebounceFn);
    }, [searchText]);


    const exportToXML = () => {
        // Crea un oggetto XML DOM
        const xmlDocument = document.implementation.createDocument('', 'Customers', null);
        
        // Crea il nodo radice
        const customersElement = xmlDocument.documentElement;
        
        list.forEach((customer) => {
            const customerElement = xmlDocument.createElement('Customer');
        
            const idElement = xmlDocument.createElement('Id');
            idElement.textContent = customer.id.toString();
            customerElement.appendChild(idElement);
        
            const nameElement = xmlDocument.createElement('Name');
            nameElement.textContent = customer.name;
            customerElement.appendChild(nameElement);
        
            const addressElement = xmlDocument.createElement('Address');
            addressElement.textContent = customer.address;
            customerElement.appendChild(addressElement);
        
            const emailElement = xmlDocument.createElement('Email');
            emailElement.textContent = customer.email;
            customerElement.appendChild(emailElement);
        
            const phoneElement = xmlDocument.createElement('Phone');
            phoneElement.textContent = customer.phone;
            customerElement.appendChild(phoneElement);
        
            const ibanElement = xmlDocument.createElement('Iban');
            ibanElement.textContent = customer.iban;
            customerElement.appendChild(ibanElement);
        
            if (customer.customerCategory) {
            const categoryElement = xmlDocument.createElement('CustomerCategory');
        
            const codeElement = xmlDocument.createElement('Code');
            codeElement.textContent = customer.customerCategory.code;
            categoryElement.appendChild(codeElement);
        
            const descriptionElement = xmlDocument.createElement('Description');
            descriptionElement.textContent = customer.customerCategory.description;
            categoryElement.appendChild(descriptionElement);
        
            customerElement.appendChild(categoryElement);
            }
        
            customersElement.appendChild(customerElement);
        });
        
        // Serializza il documento XML in stringa
        const serializer = new XMLSerializer();
        const xmlString = serializer.serializeToString(xmlDocument);
    
        const blob = new Blob([xmlString], { type: "application/xml" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Customers.xml";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
    <>
        <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Customers
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
            <TextField
                label="Search"
                variant="outlined"
                sx={{ 
                    flexGrow: 1,
                    mb: 2,
                }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />

            <Button
                variant="contained"
                sx={{
                    backgroundColor: "#42a5f5",
                    color: "white",
                    "&:hover": {
                        backgroundColor: "#2196F3",
                    },
                    mb: 2,
                    height: 56
                }}
                onClick={exportToXML}
                >
                Export to XML
            </Button>
        </Box>

        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <StyledTableHeadCell>Name</StyledTableHeadCell>
                <StyledTableHeadCell>Address</StyledTableHeadCell>
                <StyledTableHeadCell>Email</StyledTableHeadCell>
                <StyledTableHeadCell>Phone</StyledTableHeadCell>
                <StyledTableHeadCell>Iban</StyledTableHeadCell>
                <StyledTableHeadCell>Description</StyledTableHeadCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {list.map((row) => (
                <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.iban}</TableCell>
                <TableCell>{row.customerCategory?.description}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </>
    );

}


const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
  }));
