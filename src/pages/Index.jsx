import React, { useState } from "react";
import { Container, VStack, Button, Input, Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaDownload } from "react-icons/fa";
import Papa from "papaparse";
import { CSVLink } from "react-csv";

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setHeaders(Object.keys(results.data[0]));
        setData(results.data);
        setCsvData(results.data);
      },
    });
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => ({ ...acc, [header]: "" }), {});
    setData([...data, newRow]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleInputChange = (index, header, value) => {
    const newData = data.map((row, i) => (i === index ? { ...row, [header]: value } : row));
    setData(newData);
  };

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        <Button onClick={handleAddRow} leftIcon={<FaPlus />}>
          Add Row
        </Button>
        <Table variant="simple">
          <Thead>
            <Tr>
              {headers.map((header) => (
                <Th key={header}>{header}</Th>
              ))}
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {headers.map((header) => (
                  <Td key={header}>
                    <Input
                      value={row[header]}
                      onChange={(e) => handleInputChange(rowIndex, header, e.target.value)}
                    />
                  </Td>
                ))}
                <Td>
                  <IconButton
                    aria-label="Remove row"
                    icon={<FaTrash />}
                    onClick={() => handleRemoveRow(rowIndex)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Button leftIcon={<FaDownload />}>
          <CSVLink data={data} headers={headers} filename={"edited_data.csv"}>
            Download CSV
          </CSVLink>
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;