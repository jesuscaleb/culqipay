<?php

try {
  // Usando Composer (o puedes incluir las dependencias manualmente)
  require '../vendor/autoload.php';
  require '../lib/culqi.php';
  // Configurar tu API Private Key y autenticación
  $SECRET_KEY = ""; // Llave privada de tu cuenta de Culqi
  $culqi = new Culqi\Culqi(array('api_key' => $SECRET_KEY));

  // Creando Cargo a una tarjeta
  $charge = $culqi->Charges->create(
      array(
        "amount" => $_POST['monto'],
        "capture" => true,
        "currency_code" => "PEN",
        "description" => "Venta de prueba",
        "installments" => 0,
        "email" => $_POST['email'],
        "metadata" => array(
          "codigo_asesor" => $_POST['asesor'],
          "fecha_pago" => $_POST['fecha'],
          "codigo_referencia"=>$_POST['codref'],
          "correlativo"=>$_POST['corr'],
          "moneda"=>$_POST['moneda'],
          "monto" => $_POST['precio'],
          "curso"=>$_POST['idcurso']
        ),
        "source_id" => $_POST['token']
      )
  );
  // Respuesta
  echo json_encode($charge);

} catch (Exception $e) {
  // echo json_encode($e->getMessage()); 
  echo $e->getMessage();
}
