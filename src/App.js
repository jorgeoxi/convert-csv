import './App.css';
import { useState } from 'react';

function App() {
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null
  })

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  }

  const csvFileToArray = string => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map(i => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array)
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if(file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text)
      };

      fileReader.readAsText(file);
    }
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));

  // Editable Table
  const onEdit = ({ id }) => {
    setInEditMode({
      status: true,
      rowKey: id
    })
  }

  const onCancel = () => {
    // reset the inEditMode state value
    setInEditMode({
      status: false,
      rowKey: null
    })
  }

  return (
    <div style={{ textAlign: 'center'}}>
      <h1>ReactJS CSV Converter</h1>
      <form>
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />

        <button 
        onClick={(e) => {
          handleOnSubmit(e)
        }}
        >
          Import CSV
        </button>
      </form>

      <br />

      <table>
        <thead>
          <tr key={"header"}>
            {headerKeys.map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {array.map((item) =>(
            <tr key={item.id}>
              {Object.values(item).map((val) => (
                <td>
                  {
                    inEditMode.status && inEditMode.rowKey === item.id ? (
                      <input value={val} onChange={(e) => console.log('Setting new values')} />
                    ) : (
                      val
                    )
                  }
                </td>
              ))}
                <td>
                  {
                    inEditMode.status && inEditMode.rowKey === item.id ? (
                      <>
                        <button
                        onClick={() => console.log('saving data')}
                        >
                          Save
                        </button>

                        <button
                        onClick={() => onCancel()}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onEdit({id: item.id})}
                      >
                        Edit
                      </button>
                    )
                  }
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
