<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Customer Invoice</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

  <style>
    body {
      background-color: #f8f9fa;
      font-size: 14px;
    }
    .invoice-box {
      background: #fff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 0 10px rgba(0,0,0,.1);
    }
    .table th, .table td {
      vertical-align: middle;
    }
    .invoice-title h2 {
      font-size: 24px;
      font-weight: bold;
    }
    @media print {
      .no-print {
        display: none;
      }
    }
    @media print {
  @page {
    size: A4;
    margin: 20mm;
  }
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

  </style>
</head>
<body>

<div class="container my-5">
  <div class="invoice-box">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="invoice-title">
        <h2>Invoice</h2>
        <small class="text-muted">Invoice #INV-00{{$customer->id}} | Date: <?php 
        $date=date_create($customer->created_at);
        echo date_format($date,"d-m-Y");
        ?></small>
      </div>
      <img src="{{ asset('asset/site/images/logo.svg')}}" alt="Logo" class="img-fluid">
    </div>

    <div class="row mb-4">
      <div class="col-sm-6">
        <h6>From:</h6>
        <strong>{{$companys->name}}</strong><br>
         @php
        // Remove p tags and split by line breaks
        $cleanAddress = strip_tags($companys->address);
        $addressLines = explode("\n", $cleanAddress);
        foreach($addressLines as $line) {
            $trimmedLine = trim($line);
            if (!empty($trimmedLine)) {
                echo $trimmedLine . '<br>';
            }
        }
       @endphp
        Email: {{$companys->email}}<br>
        Phone: +91 {{$companys->phone}}<br>
        GST NO: {{$companys->gst}}<br>
      </div>
      <div class="col-sm-6 text-sm-end">
        <h6>To:</h6>
        <strong>{{$customer->first_name}}</strong><br>
      <br>
        Email: {{$customer->email}}<br>
        Phone: {{$customer->phone}}
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th>#</th>
            <th>Item Description</th>
            <th class="text-end">Qty</th>
           
            <th class="text-end">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>{{$customer->name}} - {{$customer->user_type}}</td>
            <td class="text-end">1</td>
           
            <td class="text-end">₹<?php echo number_format($customer->price,0) ?></td>
          </tr>
          
        </tbody>
        @php
    $total = $customer->price;               // ₹64,900 (includes GST)
    $gstPercent = 18;
    $subTotal = $total / (1 + ($gstPercent / 100)); // ₹55,000 approx.
    $gstAmount = $total - $subTotal;         // ₹9,900 approx.
@endphp
        <tfoot>
          <tr>
            <td colspan="3" class="text-end fw-bold">Subtotal</td>
            <td class="text-end">₹<?php echo number_format($subTotal,2)?></td>
          </tr>
          <tr>
            <td colspan="3" class="text-end fw-bold">GST (18%)</td>
            <td class="text-end">₹<?php echo number_format($gstAmount,2);?></td>
          </tr>
          <tr>
            <td colspan="3" class="text-end fw-bold">Total</td>
            <td class="text-end fw-bold text-primary">₹<?php echo number_format($customer->price,0) ?></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <p class="text-muted mt-4 mb-0">Thank you for your business!</p>

    <div class="text-end mt-3 no-print">
      <button class="btn btn-primary" onclick="window.print();"><i class="fas fa-print"></i> Print Invoice</button>
    </div>
    <div class="text-end mt-2 no-print">
        <button class="btn btn-danger" onclick="downloadPDF()"><i class="fas fa-file-pdf"></i> Download PDF</button>
      </div>
      
  </div>
</div>

<!-- Font Awesome for icons -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/js/all.min.js"></script>
</body>
</html>
<script>
    function downloadPDF() {
      const element = document.querySelector('.invoice-box');
      const opt = {
        margin:       0.5,
        filename:     'invoice.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    }
  </script>