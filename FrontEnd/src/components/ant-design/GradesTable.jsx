// 'use client'

// import React, { useRef, useState } from 'react';
// import { SearchOutlined } from '@ant-design/icons';
// import { Button, Input, Space, Table } from 'antd';
// import Highlighter from 'react-highlight-words';
// const data = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//   },
//   {
//     key: '2',
//     name: 'Joe Black',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//   },
//   {
//     key: '3',
//     name: 'Jim Green',
//     age: 32,
//     address: 'Sydney No. 1 Lake Park',
//   },
//   {
//     key: '4',
//     name: 'Jim Red',
//     age: 32,
//     address: 'London No. 2 Lake Park',
//   },
// ];
// const GradesTable = () => {
//   const [searchText, setSearchText] = useState('');
//   const [searchedColumn, setSearchedColumn] = useState('');
//   const searchInput = useRef(null);
//   const handleSearch = (selectedKeys, confirm, dataIndex) => {
//     confirm();
//     setSearchText(selectedKeys[0]);
//     setSearchedColumn(dataIndex);
//   };
//   const handleReset = (clearFilters) => {
//     clearFilters();
//     setSearchText('');
//   };
//   const getColumnSearchProps = (dataIndex) => ({
//     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
//       <div
//         style={{
//           padding: 8,
//         }}
//         onKeyDown={(e) => e.stopPropagation()}
//       >
//         <Input
//           ref={searchInput}
//           placeholder={`Search ${dataIndex}`}
//           value={selectedKeys[0]}
//           onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//           onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
//           style={{
//             marginBottom: 8,
//             display: 'block',
//           }}
//         />
//         <Space>
//           <Button
//             type="primary"
//             onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
//             icon={<SearchOutlined />}
//             size="small"
//             style={{
//               width: 90,
//             }}
//           >
//             Search
//           </Button>
//           <Button
//             onClick={() => clearFilters && handleReset(clearFilters)}
//             size="small"
//             style={{
//               width: 90,
//             }}
//           >
//             Reset
//           </Button>
//           <Button
//             type="link"
//             size="small"
//             onClick={() => {
//               confirm({
//                 closeDropdown: false,
//               });
//               setSearchText(selectedKeys[0]);
//               setSearchedColumn(dataIndex);
//             }}
//           >
//             Filter
//           </Button>
//           <Button
//             type="link"
//             size="small"
//             onClick={() => {
//               close();
//             }}
//           >
//             close
//           </Button>
//         </Space>
//       </div>
//     ),
//     filterIcon: (filtered) => (
//       <SearchOutlined
//         style={{
//           color: filtered ? '#1677ff' : undefined,
//         }}
//       />
//     ),
//     onFilter: (value, record) =>
//       record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
//     onFilterDropdownOpenChange: (visible) => {
//       if (visible) {
//         setTimeout(() => searchInput.current?.select(), 100);
//       }
//     },
//     render: (text) =>
//       searchedColumn === dataIndex ? (
//         <Highlighter
//           highlightStyle={{
//             backgroundColor: '#ffc069',
//             padding: 0,
//           }}
//           searchWords={[searchText]}
//           autoEscape
//           textToHighlight={text ? text.toString() : ''}
//         />
//       ) : (
//         text
//       ),
//   });
//   const columns = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//       width: '30%',
//       ...getColumnSearchProps('name'),
//     },
//     {
//       title: 'Age',
//       dataIndex: 'age',
//       key: 'age',
//       width: '20%',
//       ...getColumnSearchProps('age'),
//     },
//     {
//       title: 'Address',
//       dataIndex: 'address',
//       key: 'address',
//       ...getColumnSearchProps('address'),
//       sorter: (a, b) => a.address.length - b.address.length,
//       sortDirections: ['descend', 'ascend'],
//     },
//   ];
//   return <Table columns={columns} dataSource={data} />;
// };
// export default GradesTable;
'use client'

import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Spin } from 'antd';
import Highlighter from 'react-highlight-words';

const GradesTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        console.log('accessToken', accessToken);
        
        const response = await fetch('http://127.0.0.1:8000/api/v1/user/supervisor/grades?course_id=1&page=1&limit=10', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        const processedData = result.students.map((student, index) => ({
          key: index + 1,
          name: `${student.name || ''} ${student.surname || ''}`,
          university_id: student.university_id,
          assignments: student.assignments,
        }));

        setData(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]); // Dependency array includes accessToken


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{ padding: 8 }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => close()}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  // Ensure assignmentsColumns is initialized properly
  const assignmentsColumns = (data.length > 0 && data[0].assignments)
    ? data[0].assignments.map((assignment) => ({
        title: assignment.title,
        dataIndex: `assignment-${assignment.title}`, // Unique key for each assignment
        key: `assignment-${assignment.title}`,
        render: (text, record) => {
          const foundAssignment = record.assignments.find(a => a.title === assignment.title);
          return foundAssignment ? foundAssignment.grade : 'N/A';
        },
      }))
    : [];

  const columns = [
    {
      title: 'Order',
      dataIndex: 'key',
      key: 'key',
      width: '10%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name'),
    },
    ...assignmentsColumns,
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  return <Table className='w-full overflow-scroll overflow-y-auto' columns={columns} dataSource={data} />;
};

export default GradesTable;
