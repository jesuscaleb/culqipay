<?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        try {
            if($_POST['valid'] == 'true'){
                $mensaje = 'Esto si que funciona.';
                $estado = 'success';
                $data = array(
                    'asesor' => $_POST['asesor'],
                    'fecha' => $_POST['fecha'],
                    'corr' => $_POST['corr'],
                    'codref' => $_POST['codref'],
                    'mto' => $_POST['mto'],
                    'moneda' => $_POST['moneda'],
                    'idcurso' => $_POST['idcurso'],
                    'mensaje' => $mensaje,
                    'estado' => $estado,
                    'info' => '200'
                );
                
                echo json_encode($data);
            }else{
                $mensaje = 'Esto no funciona.';
                $estado = 'error';
                $data = array('mensaje' => $mensaje, 'estado' => $estado, 'info' => 'error');
                echo json_encode($data);
            }
		} catch (Exception $e){
 			
            $e->getMessage(); 
            
            $mensaje = 'Hubo un problema con el envio, por favor intentelo más tarde.';
            $estado = 'error';
            $data = array('mensaje' => $mensaje, 'estado' => $estado, 'info' => $e->getMessage());
            echo json_encode($data);  // no conexion a la bd
		}
    } else {
        http_response_code(403);
        $mensaje = 'Hubo un problema con el envio, por favor intentelo más tarde.';
        $estado = 'error';
        $data = array('mensaje' => $mensaje, 'estado' => $estado, 'info' => 'Error 403');
        echo json_encode($data);
    }

?>