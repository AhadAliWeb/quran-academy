import React from 'react'
import Alert from '../components/Alert'
import { useAlert } from '../hooks/useAlert'

const Test = () => {

    const { alert, showAlert } = useAlert()

  return (
    <div>

    <button onClick={() => {
        showAlert("Showing Alert", "success")
                    }}>
        Show Alert
    </button>

    {
        alert &&
        <Alert
          key={alert.id}
          message={alert.message}
          theme={alert.theme}
        />
      }

    </div>
  )
}

export default Test