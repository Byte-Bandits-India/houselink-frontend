@extends('website.layouts.app')
@section('head')
    <div class="page-header parallaxie">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="page-header-box">
                        <h1 class="text-anime-style-2" data-cursor="-opaque">Customer Dashboard</h1>
                        <nav class="wow fadeInUp">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="{{ route('index') }}">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Edit-Property</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <style>
        .view-mode-form input,
        .view-mode-form select,
        .view-mode-form textarea,
        .view-mode-form input[disabled],
        .view-mode-form select[disabled],
        .view-mode-form textarea[disabled],
        .view-mode-form input[readonly],
        .view-mode-form textarea[readonly] {
            background-color: #e9ecef !important;
            cursor: not-allowed !important;
            pointer-events: none !important;
            user-select: none !important;
        }

        .view-mode-form .form-check-input,
        .view-mode-form .form-check-label,
        .view-mode-form label,
        .view-mode-form .form-check-input[disabled],
        .view-mode-form input[type="radio"][disabled],
        .view-mode-form input[type="checkbox"][disabled],
        .view-mode-form input[type="radio"][disabled]+label,
        .view-mode-form input[type="checkbox"][disabled]+label {
            cursor: not-allowed !important;
            pointer-events: none !important;
        }

        .view-mode-form .btn:not(#nextBtn):not(#prevBtn):not(#property-type-wrapper *),
        .view-mode-form button:not(#nextBtn):not(#prevBtn):not(#property-type-wrapper button) {
            display: none !important;
        }

        /* Allow property type buttons to be visible but not clickable */
        .view-mode-form #property-type-wrapper .btn:not(.d-none) {
            display: inline-block !important;
            pointer-events: none;
            cursor: not-allowed;
        }

        /* Keep d-none buttons hidden */
        .view-mode-form #property-type-wrapper .btn.d-none {
            display: none !important;
        }

        .view-mode-form .card-body .btn,
        .view-mode-form button[onclick*="remove"],
        .view-mode-form button[onclick*="add"] {
            display: none !important;
        }

        #view-mode-banner {
            position: sticky;
            top: 0;
            z-index: 100;
            background-color: #cce5ff;
            border-color: #b8daff;
        }

        /* Block all form step content interactions except navigation */
        .view-mode-form .form-step {
            pointer-events: none;
        }

        .view-mode-form .form-step input,
        .view-mode-form .form-step select,
        .view-mode-form .form-step textarea,
        .view-mode-form .form-step button:not(#nextBtn):not(#prevBtn) {
            pointer-events: none !important;
        }

        /* Allow only navigation buttons and their container */
        .view-mode-form #nextBtn {
            pointer-events: auto !important;
            cursor: pointer !important;
        }

        .view-mode-form #prevBtn {
            pointer-events: auto !important;
            cursor: pointer !important;
            display: inline-block !important;
        }

        /* Navigation button container needs pointer events */
        .view-mode-form .mt-3 {
            pointer-events: auto !important;
        }

        /* Ensure stepper/steps remain visible */
        .view-mode-form .stepper,
        .view-mode-form .step-item {
            pointer-events: auto !important;
        }

        /* Opacity and cursor styles for non-selected fields */
        .view-mode-form .form-check-label,
        .view-mode-form .btn-outline-primary,
        .view-mode-form select option:not(:checked),
        .view-mode-form input:not(:checked):not([type="text"]):not([type="number"]):not([type="email"]):not([type="file"]),
        .view-mode-form .form-check-input[disabled]:not(:checked)+.form-check-label,
        .view-mode-form input[type="radio"][disabled]:not(:checked)+label,
        .view-mode-form input[type="checkbox"][disabled]:not(:checked)+label {
            opacity: 0.6;
            cursor: not-allowed !important;
        }

        /* Selected/checked elements keep normal opacity and cursor */
        .view-mode-form input:checked+.form-check-label,
        .view-mode-form input:checked+label,
        .view-mode-form .form-check-input:checked+.form-check-label,
        .view-mode-form .btn-outline-primary.active,
        .view-mode-form select option:checked,
        .view-mode-form .form-check-input[disabled]:checked+.form-check-label,
        .view-mode-form input[type="radio"][disabled]:checked+label,
        .view-mode-form input[type="checkbox"][disabled]:checked+label,
        .view-mode-form input[type="radio"][disabled]:checked+.form-check-label,
        .view-mode-form input[type="checkbox"][disabled]:checked+.form-check-label {
            opacity: 1 !important;
            cursor: not-allowed !important;
        }

        /* Radio button labels - non-selected */
        .view-mode-form input[type="radio"]:not(:checked)+.form-check-label,
        .view-mode-form input[type="radio"]:not(:checked)+label {
            opacity: 0.6;
            cursor: not-allowed !important;
        }

        /* Radio button labels - selected */
        .view-mode-form input[type="radio"]:checked+.form-check-label,
        .view-mode-form input[type="radio"]:checked+label,
        .view-mode-form input[type="radio"][disabled]:checked+.form-check-label,
        .view-mode-form input[type="radio"][disabled]:checked+label {
            opacity: 1 !important;
            cursor: not-allowed !important;
            background-color: #163d75 !important;
            color: #fff !important;
            border-color: #163d75 !important;
        }

        /* Checkbox labels - non-selected */
        .view-mode-form input[type="checkbox"]:not(:checked)+.form-check-label,
        .view-mode-form input[type="checkbox"]:not(:checked)+label {
            opacity: 0.6;
            cursor: not-allowed !important;
        }

        .view-mode-form input[type="checkbox"]:checked+.form-check-label,
        .view-mode-form input[type="checkbox"]:checked+label {
            opacity: 1 !important;
            cursor: default !important;
        }

        .view-mode-form input[type="checkbox"]:checked,
        .view-mode-form input[type="checkbox"][disabled]:checked,
        .view-mode-form input[type="checkbox"]:checked:disabled {
            accent-color: #163d75 !important;
            opacity: 1 !important;
            filter: none !important;
            appearance: none !important;
            -webkit-appearance: none !important;
            background-color: #163d75 !important;
            border: 2px solid #163d75 !important;
            width: 16px !important;
            height: 16px !important;
            border-radius: 3px !important;
            position: relative !important;
            cursor: not-allowed !important;
        }

        .view-mode-form input[type="checkbox"]:checked::after,
        .view-mode-form input[type="checkbox"][disabled]:checked::after,
        .view-mode-form input[type="checkbox"]:checked:disabled::after {
            content: '' !important;
            display: block !important;
            width: 4px !important;
            height: 8px !important;
            border: 2px solid #fff !important;
            border-top: none !important;
            border-left: none !important;
            transform: rotate(45deg) !important;
            position: absolute !important;
            top: 1px !important;
            left: 4px !important;
        }

        /* Button groups - non-active buttons */
        .view-mode-form .btn-outline-primary:not(.active) {
            opacity: 0.6;
            cursor: not-allowed !important;
        }

        /* Button groups - active buttons */
        .view-mode-form .btn-outline-primary.active,
        .view-mode-form #property-type-wrapper .btn.active {
            opacity: 1 !important;
            cursor: not-allowed !important;
            background-color: #163d75 !important;
            color: #fff !important;
            border-color: #163d75 !important;
        }

        .custom-radio-card input[type="radio"]:checked+label+.tick-icon {
            display: inline;
        }

        .custom-radio-card {
            position: relative;
            padding-left: 30px;
            cursor: pointer;
            user-select: none;
        }

        .form-check-inline {
            position: relative;
            padding-left: 30px;
            cursor: pointer;
            user-select: none;
        }

        .form-check-input:checked+label+.tick-icon {
            display: inline;
        }
        .form-check-label .tick-icon {
            display: none;
        }
        .form-check-input:checked + .form-check-label .tick-icon {
            display: inline !important;
        }

        .form-check-input:checked+.form-check-label {
            background-color: #163d75;
            color: #fff;
            border-color: #163d75;
        }

        .form-check-label {
            cursor: pointer;
            border: 1px solid #a3daff;
            padding: 8px 22px;
            margin-right: -2px;
            border-radius: 20px;
            transition: all 0.3s ease;
            display: inline-block;
            width: auto;
            max-width: fit-content;
        }

        /* Fix Residential/Commercial button sizing */
        .form-check-inline {
            display: inline-block !important;
            margin-right: 10px;
        }

        .form-check-inline .form-check-label {
            white-space: nowrap;
            min-width: auto;
        }

        .form-check-input {
            position: absolute;
            opacity: 0;
            /* Hide the default radio button appearance */
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            width: 0;
            height: 0;
            margin: 0;
            padding: 0;
            border: none;
            background: none;
        }

        /* NEW: Styles for disabled categories */
        .form-check-input[disabled]+.form-check-label {
            opacity: 0.6;
            /* Make it look faded */
            cursor: not-allowed !important;
            /* Change cursor to indicate it's not clickable */
        }

        .form-check-input[disabled] {
            cursor: not-allowed;
        }

        .stepper {
            display: flex;
            justify-content: space-between;
            list-style: none;
            padding: 0;
            margin: 20px 0;
            counter-reset: step;
        }

        .stepper li {
            position: relative;
            text-align: center;
            flex: 1;
            counter-increment: step;
            cursor: default;
        }

        .stepper li::before {
            content: counter(step);
            width: 30px;
            height: 30px;
            line-height: 30px;
            border: 2px solid #007bff;
            display: block;
            margin: 0 auto 10px;
            border-radius: 50%;
            background-color: white;
            color: #007bff;
            font-weight: bold;
        }

        .stepper li::after {
            content: '';
            position: absolute;
            top: 15px;
            left: 50%;
            width: 100%;
            height: 2px;
            background-color: #007bff;
            z-index: -1;
        }

        .stepper li:first-child::after {
            left: 50%;
            width: 50%;
        }

        .stepper li:last-child::after {
            width: 50%;
        }

        .stepper li.active::before {
            background-color: #007bff;
            color: white;
        }

        .stepper li.active+li::after {
            background-color: #007bff;
        }

        .stepper li small {
            display: block;
            font-size: 12px;
            color: #666;
        }

        @media (max-width: 768px) {
            .flag-tag {
                font-size: 12px;
                padding: 4px 8px;
            }

            .project-item-box {
                margin-bottom: 1.5rem;
            }

            .project-featured-image {
                height: auto;
            }

            .image-customer img {
                width: 100%;
                height: auto;
            }

            .top-customer-image i.fa-heart {
                align-self: flex-end;
                margin-top: 5px;
            }
        }

        .listingimg {
            width: 300px;
            height: -webkit-fill-available;
        }

        .nav-tabs .nav-item.show .nav-link,
        .nav-tabs .nav-link.active {
            color: #ffffff;
            background-color: #163d75;
            border-color: var(--bs-nav-tabs-link-active-border-color);
        }

        .card {
            box-shadow: var(--bs-box-shadow-lg) !important;
        }

        .dashicons {
            width: 80px;
            height: 80px;
        }

        .icontitle {
            color: #163d75;
        }

        .thead-dark {
            background-color: #163d75;
        }

        .btn-outline-primary {
            --bs-btn-color: #163d75;
            --bs-btn-border-color: #163d75a1;
            --bs-btn-hover-color: #fff;
            --bs-btn-hover-bg: #163d75;
            --bs-btn-hover-border-color: #163d75;
            --bs-btn-focus-shadow-rgb: 13, 110, 253;
            --bs-btn-active-color: #fff;
            --bs-btn-active-bg: #163d75;
            --bs-btn-active-border-color: #163d75;
            --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
            --bs-btn-disabled-color: #163d75;
            --bs-btn-disabled-bg: transparent;
            --bs-btn-disabled-border-color: #163d75;
            --bs-gradient: none;
        }

        .image-customer {
            overflow: hidden;
            border-radius: 12px;
            transition: all 0.4s ease-in-out;
            padding: 2%;
            padding-right: 50%;
            background: white;
        }

        .top-customer-image {
            position: absolute;
            top: 20px;
            left: 10px;
            right: 340px;
            display: flex;
            justify-content: space-between;
            align-items: start;
            padding: 0 10px;
            z-index: 2;
        }

        .customer-content {
            position: absolute;
            left: 380px;
            bottom: 60px;
        }

        .customer-btn {
            position: absolute;
            top: 50%;
            left: 25%;
            opacity: 0;
            visibility: hidden;
            backdrop-filter: blur(20px);
            border-radius: 50%;
            transform: translate(-50%, -30%);
            transition: all 0.3s ease-in-out;
            z-index: 1;
        }

        .bottom-customer-image {
            position: absolute;
            display: flex;
            justify-content: space-between;
            align-items: end;
            padding: 0 10px;
            z-index: 2;
            top: 240px;
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 25px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
        }

        input:checked+.slider {
            background-color: #2196F3;
        }

        input:focus+.slider {
            box-shadow: 0 0 1px #2196F3;
        }

        input:checked+.slider:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
        }

        .slider.round {
            border-radius: 34px;
        }

        .slider.round:before {
            border-radius: 50%;
        }

        .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: none;
            font-size: 18px;
            cursor: pointer;
        }

        .form-control {
            border: 1px solid #a3a3a3 !important;
        }

        .select.form-control {
            outline: 1px solid #a3a3a3 !important;
            color: #000000 !important;
        }

        .form-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .form-group {
            margin-bottom: 10px;
        }

        .radio-group {
            margin-right: 15px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .required-asterisk {
            color: #d63939;
            content: "*";
            margin-left: .25rem;
            font-weight: bold;
        }

        .toggle-hide {
            transition: all 0.3s ease-in-out;
        }

        .image-preview {
            position: relative;
            margin: 5px;
        }

        .image-preview img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 5px;
            border: 1px solid #ddd;
        }

        .remove-btn {
            position: absolute;
            top: -5px;
            right: -5px;
            background: red;
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            cursor: pointer;
            font-size: 14px;
            line-height: 1;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            z-index: 2;
        }

        .thumbnail-img {
            position: relative;
            width: 120px;
            height: 120px;
            border-radius: 5px;
            overflow: hidden;
            margin-top: 10px;
            /* Add space between label and image */
            margin-bottom: 10px;
            display: block;
            /* Ensure block layout */
        }

        .thumbnail-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 5px;
            display: block;
        }

        .remove-btn-thumbnail {
            position: absolute;
            top: -2px;
            right: -2px;
            background: #dc3545;
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            font-size: 16px;
            line-height: 20px;
            text-align: center;
            cursor: pointer;
            z-index: 2;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Style for new image remove button */
        .remove-btn-new {
            position: absolute;
            top: -2px;
            right: -2px;
            background: #dc3545;
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            font-size: 16px;
            line-height: 20px;
            text-align: center;
            cursor: pointer;
            z-index: 2;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .tag .remove {
            margin-left: 5px;
            cursor: pointer;
        }

        .tag-input {
            border: none;
            outline: none;
            flex: 1;
        }

        .form-check .form-check-label {
            min-height: 18px;
            display: block;
        }

        .form-check {
            position: relative;
            display: block;
            margin-top: 10px;
            margin-bottom: 10px;
            padding-left: 0;
        }

        .form-checka {
            position: relative;
            margin-top: 10px;
            padding-left: 1rem;
        }

        .form-check-input {
            position: absolute;
            margin-top: 0.3rem;
            margin-left: -1.25rem;
            left: 16%;
        }

        .topmargin {
            margin-top: 10px;
        }

        .leftmagin {
            margin-left: -100px;
        }

        .is-feature {
            position: absolute;
            margin-top: 0.3rem;
            margin-left: -1.25rem;
            left: 30px;
        }

        .page-header {
            background: url("{{ asset('assets/images/footer/dashboard_image.png') }}");
        }

        .edit-property {
            margin-top: 13px;
            margin-bottom: -10px;
            margin-left: 20px;
        }

        .sidebar {
            min-height: 100vh;
            border-right: 1px solid #ddd;
            background-color: #fff;
        }

        .dashboard_meanu.active {
            color: #163d75 !important;
            font-weight: bold;
            background: #e2ecfc;
            border-radius: 6px;
        }

        .nav-link {
            color: #24487d;
        }

        .header__right a {
            color: #000;
            margin-left: 10px;
        }

        .header__right a:hover {
            color: #007bff;
        }

        @media (max-width: 767.98px) {
            .sidebar {
                border-right: none;
                border-bottom: 1px solid #ddd;
                margin-bottom: 1rem;
                padding-bottom: 1rem;
            }

            .form-control {
                font-size: 14px;
            }

            .form-check-label {
                font-size: 12px;
                padding: 6px 12px;
            }

            .btn {
                padding: 8px 16px;
            }
        }

        /* Button Styles */
        .btn-primary {
            background-color: #163d75;
            border-color: #163d75;
            padding: 10px 20px;
            border-radius: 5px;
        }

        .btn-secondary {
            background-color: #6c757d;
            border-color: #6c757d;
        }

        .btn-success {
            background-color: #28a745;
            border-color: #28a745;
        }

        /* Step List Styles */
        .step-list {
            list-style: none;
            padding: 0;
        }

        .step-list li {
            padding: 10px 0;
            position: relative;
            color: #6c757d;
        }

        .step-list li.active {
            color: #163d75;
            font-weight: bold;
        }

        .step-list li:before {
            content: '';
            width: 10px;
            height: 10px;
            background-color: #6c757d;
            border-radius: 50%;
            position: absolute;
            left: -20px;
            top: 50%;
            transform: translateY(-50%);
        }

        .step-list li.active:before {
            background-color: #163d75;
        }

        .step-list li:not(:last-child):after {
            content: '';
            width: 2px;
            height: 100%;
            background-color: #6c757d;
            position: absolute;
            left: -16px;
            top: 50%;
        }

        .step-list li.active:not(:last-child):after {
            background-color: #163d75;
        }

        /* Property Score */
        .property-score {
            text-align: center;
        }

        .score-circle {
            width: 50px;
            height: 50px;
            line-height: 50px;
            border-radius: 50%;
            background-color: #e0e0e0;
            color: #333;
            font-weight: bold;
            margin: 0 auto;
        }

        .property-score p {
            font-size: 12px;
            color: #6c757d;
            margin-top: 5px;
        }

        /* Form Validation */
        .is-invalid {
            border-color: #d63939 !important;
        }

        .text-danger {
            font-size: 0.875em;
        }

        /* Prevent mouse wheel from changing number input values */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        input[type="number"] {
            -moz-appearance: textfield;
            appearance: textfield;
        }

        /* Disable mouse wheel on number inputs */
        input[type="number"]:focus {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        /* File/Image Upload Validation Styling */
        .file-size-warning.text-danger {
            background-color: #f8d7da !important;
            border: 1px solid #f5c6cb !important;
            color: #721c24 !important;
        }

        .image-upload-info {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
            padding: 8px 12px;
            border-radius: 4px;
            margin: 8px 10px 0 10px;
            font-size: 12px;
        }

        .image-upload-info i {
            margin-right: 6px;
            color: #17a2b8;
        }

        #image-success-message.text-success {
            background-color: #d4edda !important;
            border: 1px solid #c3e6cb !important;
            color: #155724 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
            font-size: 12px !important;
        }

        #seo-file-size-warning.text-warning {
            background-color: #fff3cd !important;
            border: 1px solid #ffeaa7 !important;
            color: #856404 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
            font-size: 12px !important;
        }

        #seo-image-upload-info.text-info {
            background-color: #d1ecf1 !important;
            border: 1px solid #bee5eb !important;
            color: #0c5460 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
            font-size: 12px !important;
        }

        #seo-image-success-message.text-success {
            background-color: #d4edda !important;
            border: 1px solid #c3e6cb !important;
            color: #155724 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
            font-size: 12px !important;
        }

        #video-thumbnail-file-size-warning.text-warning {
            background-color: #fff3cd !important;
            border: 1px solid #ffeaa7 !important;
            color: #856404 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
            font-size: 12px !important;
        }

        #video-thumbnail-upload-info.text-info {
            background-color: #d1ecf1 !important;
            border: 1px solid #bee5eb !important;
            color: #0c5460 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
            font-size: 12px !important;
        }

        #video-thumbnail-success-message.text-success {
            background-color: #d4edda !important;
            border: 1px solid #c3e6cb !important;
            color: #155724 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
            font-size: 12px !important;
        }
    </style>
@endsection
@section('content')
    <section class="login-page-wrapper py-4 mt-5">
        <div class="container py-2">
            <div class="row justify-content-center">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12 d-md-none mb-3">
                            <button class="btn btn-outline-primary w-100" type="button" data-bs-toggle="collapse"
                                data-bs-target="#dashboardSidebar" aria-expanded="false" aria-controls="dashboardSidebar">
                                <i class="fas fa-bars"></i> Menu
                            </button>
                        </div>
                        @include('website.layouts.sidebar')
                        <div class="col-md-10 col-12 py-4" id="dashboard-content">
                            @if (session('success'))
                                <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1055;">
                                    <div class="toast align-items-center text-bg-light border-0 show" role="alert">
                                        <div class="d-flex">
                                            <div class="toast-body">
                                                {{ session('success') }}
                                            </div>
                                            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"
                                                aria-label="Close"></button>
                                        </div>
                                    </div>
                                </div>
                            @endif
                            <div class="card">
                                <div class="card-title edit-property">
                                    <div class="col-md-10 mb-4">
                                        <h2>Edit Property</h2>
                                    </div>
                                </div>
                                <div class="step-sidebar">
                                    <ul class="stepper" role="tablist">
                                        <li class="active" aria-current="step">
                                            Basic Details
                                            <small>Step 1</small>
                                        </li>
                                        <li>
                                            Property Profile
                                            <small>Step 2</small>
                                        </li>
                                        <li>
                                            Property Location
                                            <small>Step 3</small>
                                        </li>
                                        <li>
                                            Amenities Section
                                            <small>Step 4</small>
                                        </li>
                                        <li>
                                            Final Submit
                                            <small>Step 5</small>
                                        </li>
                                    </ul>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        @if (session('error'))
                                            <div class="alert alert-danger">
                                                {{ session('error') }}
                                            </div>
                                        @endif
                                        <form id="propertyForm" method="POST"
                                            action="{{ route('property.update', $property->id) }}"
                                            enctype="multipart/form-data" onsubmit="return syncFileInputBeforeSubmit()">
                                            @csrf
                                            @method('PUT')
                                            <input type="hidden" id="property_id" name="property_id"
                                                value="{{ $property->id }}">

                                            <div class="form-step" id="step-1">
                                                <legend class="col-form-label col-sm-2 pt-0">Property For <span
                                                        class="text-danger">*</span></legend>
                                                @php
                                                    $propertyFor = old(
                                                        'property_for',
                                                        $property->property_for ?? 'sell',
                                                    );
                                                @endphp
                                                <div class="row mb-3">
                                                    <div class="col-md-2">
                                                        <div class="form-check form-check-inline custom-radio-card">
                                                            <input type="radio" class="form-check-input"
                                                                name="property_for" id="for_sell" value="sell"
                                                                {{ $propertyFor == 'sell' ? 'checked' : '' }}
                                                                {{ $propertyFor != 'sell' ? 'disabled' : '' }}>
                                                            <label class="form-check-label" for="for_sell"
                                                                @if ($propertyFor != 'sell') onclick="showAlertOnDisabledPropertyFor(event, '{{ $propertyFor }}')" @endif>
                                                                Sell <i class="fa fa-check check-icon"
                                                                    style="font-size:16px; display: {{ $propertyFor == 'sell' ? 'inline' : 'none' }};"></i>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <div class="form-check form-check-inline custom-radio-card">
                                                            <input type="radio" class="form-check-input" name="property_for" id="for_rent" value="rent"
                                                                {{ in_array($propertyFor, ['rent', 'lease']) ? 'checked' : '' }}
                                                                {{ !in_array($propertyFor, ['rent', 'lease']) ? 'disabled' : '' }}>
                                                            <label class="form-check-label" for="for_rent"
                                                                @if (!in_array($propertyFor, ['rent', 'lease'])) onclick="showAlertOnDisabledPropertyFor(event, '{{ $propertyFor }}')" @endif>
                                                                    Rent / Lease <i class="fa fa-check check-icon" style="font-size:16px; display: {{ in_array($propertyFor, ['rent', 'lease']) ? 'inline' : 'none' }};"></i>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <legend class="col-form-label col-sm-2 pt-0">Are you ? <span class="text-danger">*</span> </legend>
                                                @php $ownerType = old('owner_type', $property->owner_type ?? ''); @endphp

                                                <div class="row">
                                                    @php
                                                        $isOwnerChecked  = $ownerType == 'Owner';
                                                        $disableOwner    = $ownerType != '' && !$isOwnerChecked;
                                                    @endphp
                                                    <div class="col-md-2">
                                                        <div class="form-check form-check-inline custom-radio-card">
                                                            <input type="radio" class="form-check-input"
                                                                name="owner_type" id="owner_owner" value="Owner"
                                                                required
                                                                {{ $isOwnerChecked ? 'checked' : '' }}
                                                                {{ $disableOwner   ? 'disabled' : '' }}>
                                                            <label class="form-check-label" for="owner_owner"
                                                                @if ($disableOwner) onclick="showAlertOnDisabledOwnerType(event, '{{ $ownerType }}')" @endif>
                                                                Owner <i class="fa fa-check check-icon" style="font-size:16px; display: none;"></i>
                                                            </label>
                                                            @error('owner_type') <span class="text-danger">{{ $message }}</span> @enderror
                                                        </div>
                                                    </div>
                                                    @if (in_array($propertyFor, ['sell']))
                                                        @php
                                                            $isBuilderChecked = $ownerType == 'Builder';
                                                            $disableBuilder   = $ownerType != '' && !$isBuilderChecked;
                                                        @endphp
                                                        <div class="col-md-3">
                                                            <div class="form-check form-check-inline custom-radio-card">
                                                                <input class="form-check-input" type="radio"
                                                                    name="owner_type" id="builderRadio" value="Builder"
                                                                    {{ $isBuilderChecked ? 'checked' : '' }}
                                                                    {{ $disableBuilder   ? 'disabled' : '' }}>
                                                                <label class="form-check-label" for="builderRadio"
                                                                    @if ($disableBuilder) onclick="showAlertOnDisabledOwnerType(event, '{{ $ownerType }}')" @endif>
                                                                    Builder <i class="fa fa-check check-icon" style="font-size:16px; display: none;"></i>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    @endif
                                                    @php
                                                        $isConsultantChecked = $ownerType == 'Consultant';
                                                        $disableConsultant   = $ownerType != '' && !$isConsultantChecked;
                                                    @endphp
                                                    <div class="col-md-3">
                                                        <div class="form-check form-check-inline custom-radio-card">
                                                            <input class="form-check-input" type="radio"
                                                                name="owner_type" id="consultantRadio" value="Consultant"
                                                                {{ $isConsultantChecked ? 'checked' : '' }}
                                                                {{ $disableConsultant   ? 'disabled' : '' }}>
                                                            <label class="form-check-label" for="consultantRadio"
                                                                @if ($disableConsultant) onclick="showAlertOnDisabledOwnerType(event, '{{ $ownerType }}')" @endif>
                                                                Consultant <i class="fa fa-check check-icon" style="font-size:16px; display: none;"></i>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <h6 class="mt-4 mb-2">And its a ... <span class="text-danger">*</span>
                                                </h6>
                                                <div class="form-group">
                                                    @php
                                                        $propertyMainType = old('property_main_type', $property->property_main_type ?? null);
                                                        if (!$propertyMainType) {
                                                            $catObjForType = isset($re_categorie) ? $re_categorie->firstWhere('id', $property->category_id) : null;
                                                            $propertyMainType = ($catObjForType && $catObjForType->group === 'commercial') ? 'commercial' : 'residential';
                                                        }
                                                    @endphp
                                                    <div class="form-check form-check-inline">
                                                        <input type="radio" class="form-check-input"
                                                            name="property_main_type" id="type_residential"
                                                            value="residential"
                                                            {{ $propertyMainType == 'residential' ? 'checked' : '' }}
                                                            onchange="step1_updatePropertyTypeButtons()">
                                                        <label class="form-check-label"
                                                            for="type_residential">Residential</label>
                                                    </div>
                                                    <div class="form-check form-check-inline">
                                                        <input type="radio" class="form-check-input"
                                                            name="property_main_type" id="type_commercial"
                                                            value="commercial"
                                                            {{ $propertyMainType == 'commercial' ? 'checked' : '' }}
                                                            onchange="step1_updatePropertyTypeButtons()">
                                                        <label class="form-check-label"
                                                            for="type_commercial">Commercial</label>
                                                    </div>
                                                </div>

                                                <h6 class="mt-3 mb-2">Property Type <span class="text-danger">*</span>
                                                </h6>
                                                @php
                                                    $savedSubtype = old('property_subtype', $property->property_subtype ?? '');
                                                    if (!$savedSubtype) {
                                                        $catToSubtype = [
                                                            'apartments'      => 'apartment',
                                                            'villas'          => 'villa',
                                                            'individual house'=> 'individual_house',
                                                            'plots'           => 'plot',
                                                            'land'            => 'land',
                                                            'shop'            => 'shop',
                                                            'building'        => 'building',
                                                            'godown'          => 'godown',
                                                            'warehouse'       => 'warehouse',
                                                            'office space'    => 'office_space',
                                                        ];
                                                        $catObj = isset($re_categorie) ? $re_categorie->firstWhere('id', $property->category_id) : null;
                                                        $catNameLower = $catObj ? strtolower($catObj->name) : '';
                                                        $savedSubtype = $catToSubtype[$catNameLower] ?? '';
                                                    }
                                                    $isCommercialSubtype = in_array($savedSubtype, ['land', 'land_lease', 'shop', 'building', 'godown', 'warehouse', 'office_space'])
                                                        || $propertyMainType === 'commercial';
                                                    function subtypeBtn($s, $saved) {
                                                        return $s === $saved ? 'btn-primary' : 'btn-outline-primary';
                                                    }
                                                @endphp
                                                <div class="form-group mb-3">
                                                    <div class="d-flex flex-wrap" id="property-type-wrapper">
                                                        <button type="button"
                                                            class="btn {{ subtypeBtn('apartment',$savedSubtype) }} me-2 mb-2 res-type {{ $isCommercialSubtype ? 'd-none' : '' }}"
                                                            data-type="apartment">Apartment</button>
                                                        <button type="button"
                                                            class="btn {{ subtypeBtn('villa',$savedSubtype) }} me-2 mb-2 res-type {{ $isCommercialSubtype ? 'd-none' : '' }}"
                                                            data-type="villa">Villa</button>
                                                        <button type="button"
                                                            class="btn {{ subtypeBtn('individual_house',$savedSubtype) }} me-2 mb-2 res-type {{ $isCommercialSubtype ? 'd-none' : '' }}"
                                                            data-type="individual_house">Individual House</button>
                                                        <button type="button"
                                                            class="btn {{ subtypeBtn('plot',$savedSubtype) }} me-2 mb-2 {{ ($savedSubtype === 'plot') ? '' : 'd-none' }}"
                                                            id="btn-plot" data-type="plot">Plots</button>
                                                        <button type="button"
                                                            class="btn {{ subtypeBtn('land',$savedSubtype) }} me-2 mb-2 com-type {{ $isCommercialSubtype ? '' : 'd-none' }}"
                                                            id="btn-land" data-type="land">Land</button>
                                                        <button type="button"
                                                            class="btn {{ subtypeBtn('shop',$savedSubtype) }} me-2 mb-2 com-type {{ $isCommercialSubtype ? '' : 'd-none' }}"
                                                            data-type="shop">Shop</button>
                                                        <button type="button"
                                                            class="btn {{ subtypeBtn('building',$savedSubtype) }} me-2 mb-2 com-type {{ $isCommercialSubtype ? '' : 'd-none' }}"
                                                            data-type="building">Building</button>
                                                        <button type="button"
                                                            class="btn {{ subtypeBtn('godown',$savedSubtype) }} me-2 mb-2 com-type {{ $isCommercialSubtype ? '' : 'd-none' }}"
                                                            data-type="godown">Godown</button>
                                                        <button type="button"
                                                            class="btn {{ subtypeBtn('warehouse',$savedSubtype) }} me-2 mb-2 com-type {{ $isCommercialSubtype ? '' : 'd-none' }}"
                                                            data-type="warehouse">Warehouse</button>
                                                        <button type="button"
                                                            class="btn {{ subtypeBtn('office_space',$savedSubtype) }} me-2 mb-2 com-type {{ $isCommercialSubtype ? '' : 'd-none' }}"
                                                            data-type="office_space">Office Space</button>
                                                    </div>

                                                    <input type="hidden" name="property_subtype" id="property_subtype"
                                                        value="{{ $savedSubtype }}">
                                                    <input type="hidden" name="category_id" id="category_id"
                                                        value="{{ old('category_id', $property->category_id ?? '') }}">
                                                    <span class="text-danger" id="property_subtype_error"></span>
                                                </div>
                                                <div id="step1-dynamic-fields" class="mt-4">
                                                    <div id="dynamic-fields-outer" class="border p-3 rounded bg-light d-none">
                                                    <div id="field-group-plot" class="dynamic-group">
                                                        <div class="row">
                                                            <div class="col-md-3 mb-3">
                                                                <label class="form-label" id="label_plot_area">Land Area <span class="text-danger">*</span></label>
                                                                <input type="number" class="form-control" name="plot_area" id="input_plot_area"
                                                                    value="{{ old('plot_area', $property->plot_area ?? $existingFieldValues['Plot Area']['value'] ?? $existingFieldValues['Land Area']['value'] ?? '') }}">
                                                            </div>
                                                            @php $plotUnit = old('plot_unit', $existingFieldValues['Plot Area']['unit'] ?? $existingFieldValues['Land Area']['unit'] ?? ''); @endphp
                                                            <div class="col-md-3 mb-3">
                                                                <label class="form-label">Unit <span class="text-danger">*</span></label>
                                                                <select class="form-select" name="plot_unit">
                                                                    <option value="">Select Unit</option>
                                                                    <option value="1" {{ $plotUnit == '1' ? 'selected' : '' }}>Sq. Ft</option>
                                                                    <option value="2" {{ $plotUnit == '2' ? 'selected' : '' }}>Square Inches</option>
                                                                    <option value="3" {{ $plotUnit == '3' ? 'selected' : '' }}>Acres</option>
                                                                    <option value="4" {{ $plotUnit == '4' ? 'selected' : '' }}>Cents</option>
                                                                    <option value="5" {{ $plotUnit == '5' ? 'selected' : '' }}>Square Meters</option>
                                                                    <option value="6" {{ $plotUnit == '6' ? 'selected' : '' }}>Square Yards</option>
                                                                    <option value="7" {{ $plotUnit == '7' ? 'selected' : '' }}>Hectares</option>
                                                                </select>
                                                            </div>
                                                            <div class="col-md-3 mb-3 d-none" id="plot-length-col">
                                                                <label class="form-label">Length</label>
                                                                <input type="number" class="form-control" name="plot_length"
                                                                    value="{{ old('plot_length', $existingFieldValues['Plot Length']['value'] ?? $existingFieldValues['Length']['value'] ?? '') }}">
                                                            </div>
                                                            <div class="col-md-3 mb-3 d-none" id="plot-breadth-col">
                                                                <label class="form-label">Breadth</label>
                                                                <input type="number" class="form-control" name="plot_breadth"
                                                                    value="{{ old('plot_breadth', $existingFieldValues['Plot Breadth']['value'] ?? $existingFieldValues['Breadth']['value'] ?? '') }}">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="field-group-structure"
                                                        class="dynamic-group">
                                                        <div class="row">
                                                            <div class="col-md-3 mb-3">
                                                                <label class="form-label">Built-Up Area <span
                                                                        class="text-danger">*</span></label>
                                                                <input type="number" class="form-control"
                                                                    name="super_builtup_area" id="input_builtup_area"
                                                                    value="{{ old('super_builtup_area', $property->super_builtup_area ?? $existingFieldValues['Built-Up Area']['value'] ?? $existingFieldValues['Built-up Area']['value'] ?? '') }}">
                                                            </div>
                                                            <div class="col-md-3 mb-3">
                                                                <label class="form-label">Unit <span
                                                                        class="text-danger">*</span></label>
                                                                @php $builtupUnit = old('builtup_unit', $property->builtup_unit ?? $existingFieldValues['Built-Up Area']['unit'] ?? $existingFieldValues['Built-up Area']['unit'] ?? ''); @endphp
                                                                <select class="form-select" name="builtup_unit">
                                                                    <option value="">Select Unit</option>
                                                                    <option value="1"
                                                                        {{ $builtupUnit == '1' ? 'selected' : '' }}>
                                                                        Sq. Ft</option>
                                                                    <option value="2"
                                                                        {{ $builtupUnit == '2' ? 'selected' : '' }}>
                                                                        Square Inches</option>
                                                                    <option value="3"
                                                                        {{ $builtupUnit == '3' ? 'selected' : '' }}>
                                                                        Acres</option>
                                                                    <option value="4"
                                                                        {{ $builtupUnit == '4' ? 'selected' : '' }}>
                                                                        Cents</option>
                                                                    <option value="5"
                                                                        {{ $builtupUnit == '5' ? 'selected' : '' }}>
                                                                        Square Meters</option>
                                                                    <option value="6"
                                                                        {{ $builtupUnit == '6' ? 'selected' : '' }}>
                                                                        Square Yards</option>
                                                                    <option value="7"
                                                                        {{ $builtupUnit == '7' ? 'selected' : '' }}>
                                                                        Hectares</option>
                                                                </select>
                                                            </div>
                                                            <div class="col-md-3 mb-3" id="col_carpet_area">
                                                                <label class="form-label">Carpet Area</label>
                                                                <input type="number" class="form-control"
                                                                    name="carpet_area"
                                                                    value="{{ old('carpet_area', $property->carpet_area ?? $existingFieldValues['Carpet Area']['value'] ?? '') }}">
                                                            </div>
                                                            <div class="col-md-3 mb-3" id="col_carpet_unit">
                                                                <label class="form-label">Unit</label>
                                                                <select class="form-select" name="carpet_unit">
                                                                    <option value="">Select Unit</option>
                                                                    <option value="1"
                                                                        @php $carpetUnit = old('carpet_unit', $property->carpet_unit ?? $existingFieldValues['Carpet Area']['unit'] ?? ''); @endphp
                                                                    {{ $carpetUnit == '1' ? 'selected' : '' }}>
                                                                        Sq. Ft</option>
                                                                    <option value="2"
                                                                        {{ $carpetUnit == '2' ? 'selected' : '' }}>
                                                                        Square Inches</option>
                                                                    <option value="3"
                                                                        {{ $carpetUnit == '3' ? 'selected' : '' }}>
                                                                        Acres</option>
                                                                    <option value="4"
                                                                        {{ $carpetUnit == '4' ? 'selected' : '' }}>
                                                                        Cents</option>
                                                                    <option value="5"
                                                                        {{ $carpetUnit == '5' ? 'selected' : '' }}>
                                                                        Square Meters</option>
                                                                    <option value="6"
                                                                        {{ $carpetUnit == '6' ? 'selected' : '' }}>
                                                                        Square Yards</option>
                                                                    <option value="7"
                                                                        {{ $carpetUnit == '7' ? 'selected' : '' }}>
                                                                        Hectares</option>
                                                                </select>
                                                            </div>

                                                            <div class="col-md-3 mb-3 d-none" id="storage_area_wrapper">
                                                                <label class="form-label">Storage Area <span
                                                                        class="text-danger">*</span></label>
                                                                <input type="number" class="form-control"
                                                                    name="storage_area" id="input_storage_area"
                                                                    value="{{ old('storage_area', $property->storage_area ?? $existingFieldValues['Storage Area']['value'] ?? '') }}">
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div id="field-group-apartment"
                                                        class="dynamic-group d-none mt-0">
                                                        <div class="row">
                                                            <div class="col-md-3 mb-3">
                                                                <label class="form-label">Total Floors <span
                                                                        class="text-danger">*</span></label>
                                                                <input type="number" class="form-control"
                                                                    name="total_floors" id="input_total_floors"
                                                                    value="{{ old('total_floors', $property->total_floors ?? $existingFieldValues['Total Floors']['value'] ?? $existingFieldValues['total_floors']['value'] ?? '') }}">
                                                            </div>
                                                            <div class="col-md-3 mb-3">
                                                                <label class="form-label">Property On Floor <span
                                                                        class="text-danger">*</span></label>
                                                                <input type="number" class="form-control"
                                                                    name="property_on_floor" id="input_property_on_floor"
                                                                    value="{{ old('property_on_floor', $property->property_on_floor ?? $existingFieldValues['Property On Floor']['value'] ?? $existingFieldValues['Property on Floor']['value'] ?? '') }}">
                                                            </div>
                                                            <div class="col-md-3 mb-3" id="uds_field_wrapper">
                                                                <label class="form-label">UDS Area</label>
                                                                <input type="number" class="form-control"
                                                                    name="uds_area" id="input_uds_area"
                                                                    placeholder="Undivided Share Area"
                                                                    value="{{ old('uds_area', $existingFieldValues['UDS']['value'] ?? $existingFieldValues['UDS Area']['value'] ?? '') }}">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </div>{{-- /dynamic-fields-outer --}}
                                                </div>
                                                <script>
                                                    function toggleUDSField() {
                                                        const subtype     = document.getElementById('property_subtype')?.value;
                                                        const propertyFor = '{{ $property->property_for }}';
                                                        const udsWrapper  = document.getElementById('uds_field_wrapper');
                                                        const udsInput    = document.getElementById('input_uds_area');

                                                        if (!udsWrapper || !udsInput) return;

                                                        if (subtype === 'apartment' && propertyFor === 'sell') {
                                                            udsWrapper.classList.remove('d-none');
                                                        } else {
                                                            udsWrapper.classList.add('d-none');
                                                            udsInput.value = '';
                                                        }
                                                    }

                                                    document.addEventListener('DOMContentLoaded', function() {
                                                        document.querySelectorAll('input[name="property_for"]').forEach(radio => {
                                                            radio.addEventListener('change', function() {
                                                                toggleUDSField();
                                                                if (typeof updateCommercialButtonsVisibility === 'function') {
                                                                    updateCommercialButtonsVisibility();
                                                                }
                                                                const tenantWrapper = document.getElementById('tenant_preference_wrapper');
                                                                if (tenantWrapper) {
                                                                    if (this.value === 'sell') {
                                                                        tenantWrapper.classList.remove('d-flex');
                                                                        tenantWrapper.classList.add('d-none');
                                                                    } else {
                                                                        tenantWrapper.classList.remove('d-none');
                                                                        tenantWrapper.classList.add('d-flex');
                                                                    }
                                                                }
                                                                const autoRenewalCard = document.getElementById('autoRenewalCard');
                                                                if (autoRenewalCard) {
                                                                    autoRenewalCard.style.display = ['rent', 'lease'].includes(this.value) ? 'none' : '';
                                                                }
                                                            });
                                                        });

                                                        const wrapper = document.getElementById('property-type-wrapper');
                                                        if (wrapper) {
                                                            wrapper.addEventListener('click', function(e) {
                                                                if (e.target.closest('button')) {
                                                                    setTimeout(toggleUDSField, 50);
                                                                }
                                                            });
                                                        }

                                                        setTimeout(toggleUDSField, 100);
                                                        setTimeout(function() {
                                                            if (typeof updateCommercialButtonsVisibility === 'function') {
                                                                updateCommercialButtonsVisibility();
                                                            }
                                                        }, 150);
                                                    });

                                                    const totalFloors = document.getElementById('input_total_floors');
                                                    const propertyFloor = document.getElementById('input_property_on_floor');
                                                    if (totalFloors && propertyFloor) {
                                                        function validateFloors() {
                                                            let total = parseInt(totalFloors.value);
                                                            let property = parseInt(propertyFloor.value);
                                                            if (total > 100) {
                                                                alert('Total Floors cannot be more than 100');
                                                                totalFloors.value = 100;
                                                                total = 100;
                                                            }
                                                            if (property && total && property > total) {
                                                                alert('Property On Floor must be less than or equal to Total Floors');
                                                                propertyFloor.value = total;
                                                            }
                                                        }
                                                        totalFloors.addEventListener('input', validateFloors);
                                                        propertyFloor.addEventListener('input', validateFloors);
                                                        totalFloors.addEventListener('blur', validateFloors);
                                                        propertyFloor.addEventListener('blur', validateFloors);
                                                    }

                                                    const unitNames = ['plot_unit', 'builtup_unit', 'carpet_unit'];

                                                    function consolidateUnits() {
                                                        let firstVisibleContainer = null;
                                                        let masterSelect = null;

                                                        unitNames.forEach(name => {
                                                            const select = document.querySelector(`select[name="${name}"]`);
                                                            if (!select) return;

                                                            const container = select.closest('.col-md-6');
                                                            const group = select.closest('.dynamic-group');
                                                            if (container) container.style.display = 'block';
                                                            const isVisible = group && !group.classList.contains('d-none');
                                                            if (isVisible) {
                                                                if (!firstVisibleContainer) {
                                                                    firstVisibleContainer = container;
                                                                    masterSelect = select;
                                                                } else {
                                                                    if (container) container.style.display = 'none';
                                                                }
                                                            }
                                                        });
                                                        if (masterSelect) {
                                                            masterSelect.addEventListener('change', function() {
                                                                const val = this.value;
                                                                unitNames.forEach(name => {
                                                                    const otherSelect = document.querySelector(`select[name="${name}"]`);
                                                                    if (otherSelect) otherSelect.value = val;
                                                                });
                                                            });
                                                        }
                                                    }

                                                    document.addEventListener('DOMContentLoaded', function() {
                                                        initFormLogic();
                                                        setTimeout(consolidateUnits, 100);

                                                        const typeWrapper = document.getElementById('property-type-wrapper');
                                                        if (typeWrapper) {
                                                            typeWrapper.addEventListener('click', function(e) {
                                                                if (e.target.tagName === 'BUTTON') {
                                                                    setTimeout(consolidateUnits, 100);
                                                                }
                                                            });
                                                        }
                                                        document.querySelectorAll('input[name="property_main_type"]').forEach(radio => {
                                                            radio.addEventListener('change', function() {
                                                                setTimeout(consolidateUnits, 100);
                                                            });
                                                        });
                                                    });
                                                    function initFormLogic() {
                                                        setupPropertyTypeButtons();

                                                        if (typeof window.step1_updatePropertyTypeButtons === 'function') {
                                                            window.step1_updatePropertyTypeButtons();
                                                        }

                                                        const mainTypeRadios = document.querySelectorAll('input[name="property_main_type"]');
                                                        mainTypeRadios.forEach(radio => radio.addEventListener('change', updateMainTypeVisibility));

                                                        document.querySelectorAll('input[name="property_for"]').forEach(radio => {
                                                            radio.addEventListener('change', function() {
                                                                updateMainTypeVisibility();
                                                            });
                                                        });

                                                        updateMainTypeVisibility();

                                                        if (typeof updateCommercialButtonsVisibility === 'function') {
                                                            updateCommercialButtonsVisibility();
                                                        }

                                                        setTimeout(consolidateUnits, 150);
                                                    }

                                                    function setupPropertyTypeButtons() {
                                                        const wrapper = document.getElementById('property-type-wrapper');
                                                        if (!wrapper) return;

                                                        const categoryMap = {
                                                            'apartment': 1,
                                                            'villa': 2,
                                                            'individual_house': 4,
                                                            'plot': 3,
                                                            'land': 5,
                                                            'land_lease': 5,
                                                            'shop': 7,
                                                            'building': 8,
                                                            'godown': 9,
                                                            'warehouse': 10,
                                                            'office_space': 11
                                                        };

                                                        wrapper.addEventListener('click', function(e) {
                                                            const btn = e.target.closest('button');
                                                            if (btn) {
                                                                wrapper.querySelectorAll('button').forEach(b => {
                                                                    b.classList.remove('btn-primary');
                                                                    b.classList.add('btn-outline-primary');
                                                                });
                                                                btn.classList.remove('btn-outline-primary');
                                                                btn.classList.add('btn-primary');

                                                                const subtype = btn.getAttribute('data-type');
                                                                document.getElementById('property_subtype').value = subtype;

                                                                const catId = categoryMap[subtype];
                                                                if (catId) document.getElementById('category_id').value = catId;

                                                                if (typeof switchTenantPreferences === 'function') {
                                                                    switchTenantPreferences(subtype);
                                                                }

                                                                document.querySelectorAll('.dynamic-group').forEach(el => el.classList.add('d-none'));
                                                                document.getElementById('dynamic-fields-outer')?.classList.add('d-none');

                                                                if (['plot', 'land_lease'].includes(subtype)) {
                                                                    document.getElementById('field-group-plot')?.classList.remove('d-none');
                                                                } else if (subtype === 'apartment') {
                                                                    document.getElementById('field-group-structure')?.classList.remove('d-none');
                                                                    document.getElementById('field-group-apartment')?.classList.remove('d-none');
                                                                } else if (subtype === 'shop') {
                                                                    document.getElementById('field-group-structure')?.classList.remove('d-none');
                                                                    document.getElementById('field-group-apartment')?.classList.remove('d-none');
                                                                } else {
                                                                    document.getElementById('field-group-structure')?.classList.remove('d-none');
                                                                }
                                                                document.getElementById('dynamic-fields-outer')?.classList.remove('d-none');
                                                            }
                                                        });
                                                    }

                                                    function updateMainTypeVisibility() {
                                                        const mainType = document.querySelector('input[name="property_main_type"]:checked')?.value || 'residential';
                                                        const propertyFor = document.querySelector('input[name="property_for"]:checked')?.value || 'sell';
                                                        const resBtns = document.querySelectorAll('#property-type-wrapper .res-type');
                                                        const comBtns = document.querySelectorAll('#property-type-wrapper .com-type');
                                                        const btnPlot = document.getElementById('btn-plot');
                                                        if (mainType === 'residential') {
                                                            resBtns.forEach(b => b.classList.remove('d-none'));
                                                            comBtns.forEach(b => b.classList.add('d-none'));
                                                            if (btnPlot) {
                                                                btnPlot.classList.toggle('d-none', propertyFor !== 'sell');
                                                            }
                                                            const subtypeInput = document.getElementById('property_subtype');
                                                            if (subtypeInput && !['apartment', 'villa', 'individual_house', 'plot'].includes(subtypeInput.value)) {
                                                                subtypeInput.value = '';
                                                            }
                                                        } else {
                                                            resBtns.forEach(b => b.classList.add('d-none'));
                                                            comBtns.forEach(b => b.classList.remove('d-none'));
                                                            if (btnPlot) btnPlot.classList.add('d-none');
                                                            if (typeof updateCommercialButtonsVisibility === 'function') {
                                                                updateCommercialButtonsVisibility();
                                                            }
                                                        }
                                                    }

                                                    function updateCommercialButtonsVisibility() {
                                                        const mainType = document.querySelector('input[name="property_main_type"]:checked')?.value || 'residential';
                                                        const propertyFor = document.querySelector('input[name="property_for"]:checked')?.value || 'sell';
                                                        const btnPlot = document.getElementById('btn-plot');
                                                        const btnLand = document.getElementById('btn-land');
                                                        if (btnPlot) btnPlot.classList.add('d-none');
                                                        if (mainType === 'residential') {
                                                            if (btnLand) btnLand.classList.add('d-none');
                                                            return;
                                                        }
                                                        if (btnLand) btnLand.classList.remove('d-none');
                                                    }

                                                    function switchTenantPreferences(subtype) {
                                                        const resGroup = document.getElementById('residential_tenant_prefs');
                                                        const commGroup = document.getElementById('commercial_tenant_prefs');
                                                        const commercialTypes = ['plot', 'land', 'land_lease', 'shop', 'building', 'godown', 'warehouse',
                                                            'office_space'];

                                                        if (commercialTypes.includes(subtype)) {
                                                            if (resGroup) resGroup.style.display = 'none';
                                                            if (commGroup) commGroup.style.display = 'block';
                                                        } else {
                                                            if (resGroup) resGroup.style.display = 'block';
                                                            if (commGroup) commGroup.style.display = 'none';
                                                        }
                                                    }

                                                    window.step1_updatePropertyTypeButtons = function() {
                                                        const subtype = document.getElementById('property_subtype')?.value;

                                                        // Hide all groups first
                                                        document.querySelectorAll('.dynamic-group').forEach(el => el.classList.add('d-none'));
                                                        document.getElementById('dynamic-fields-outer')?.classList.add('d-none');

                                                        if (!subtype) return;

                                                        // Helper to show/hide individual fields inside groups
                                                        const show = id => { const el = document.getElementById(id); if (el) el.classList.remove('d-none'); };
                                                        const hide = id => { const el = document.getElementById(id); if (el) el.classList.add('d-none'); };

                                                        if (subtype === 'apartment') {
                                                            document.getElementById('field-group-structure')?.classList.remove('d-none');
                                                            document.getElementById('field-group-apartment')?.classList.remove('d-none');
                                                            hide('col_carpet_area');
                                                            hide('col_carpet_unit');
                                                            hide('storage_area_wrapper');
                                                            hide('plot-length-col');
                                                            hide('plot-breadth-col');

                                                        } else if (['villa', 'individual_house'].includes(subtype)) {
                                                            document.getElementById('field-group-plot')?.classList.remove('d-none');
                                                            document.getElementById('field-group-structure')?.classList.remove('d-none');
                                                            const plotLabel = document.getElementById('label_plot_area');
                                                            if (plotLabel) plotLabel.innerHTML = 'Land Area <span class="text-danger">*</span>';
                                                            hide('plot-length-col');
                                                            hide('plot-breadth-col');
                                                            show('col_carpet_area');
                                                            hide('col_carpet_unit');
                                                            hide('storage_area_wrapper');

                                                        } else if (subtype === 'plot') {
                                                            document.getElementById('field-group-plot')?.classList.remove('d-none');
                                                            const plotLabel = document.getElementById('label_plot_area');
                                                            if (plotLabel) plotLabel.innerHTML = 'Plot Area <span class="text-danger">*</span>';
                                                            show('plot-length-col');
                                                            show('plot-breadth-col');
                                                            hide('col_carpet_area');
                                                            hide('col_carpet_unit');

                                                        } else if (subtype === 'land' || subtype === 'land_lease') {
                                                            document.getElementById('field-group-plot')?.classList.remove('d-none');
                                                            const plotLabel = document.getElementById('label_plot_area');
                                                            if (plotLabel) plotLabel.innerHTML = 'Land Area <span class="text-danger">*</span>';
                                                            show('plot-length-col');
                                                            show('plot-breadth-col');

                                                        } else if (['shop', 'building', 'office_space'].includes(subtype)) {
                                                            document.getElementById('field-group-structure')?.classList.remove('d-none');
                                                            document.getElementById('field-group-apartment')?.classList.remove('d-none');
                                                            show('col_carpet_area');
                                                            hide('col_carpet_unit');
                                                            hide('storage_area_wrapper');
                                                            hide('plot-length-col');
                                                            hide('plot-breadth-col');

                                                        } else if (['godown', 'warehouse'].includes(subtype)) {
                                                            document.getElementById('field-group-structure')?.classList.remove('d-none');
                                                            document.getElementById('field-group-apartment')?.classList.remove('d-none');
                                                            show('col_carpet_area');
                                                            hide('col_carpet_unit');
                                                            show('storage_area_wrapper');
                                                            hide('plot-length-col');
                                                            hide('plot-breadth-col');

                                                        } else {
                                                            document.getElementById('field-group-structure')?.classList.remove('d-none');
                                                            show('col_carpet_area');
                                                            hide('col_carpet_unit');
                                                        }

                                                        document.getElementById('dynamic-fields-outer')?.classList.remove('d-none');
                                                        setTimeout(consolidateUnits, 150);
                                                    };
                                                </script>

                                                <div id="customFieldsContainer"></div>
                                            </div>
                                            <div class="form-step d-none" id="step-2">
                                                <div class="form-group">
                                                    <label for="name">Property Name <span class="text-danger">*</span>
                                                    </label>
                                                    <input type="text" class="form-control" name="name"
                                                        id="name" value="{{ old('name', $property->name) }}"
                                                        required>

                                                    <div id="name_error" class="text-danger dynamic-error"></div>
                                                    @error('name')
                                                        <span class="text-danger">{{ $message }}</span>
                                                    @enderror
                                                </div>

                                                <div id="permalink-section" style="display: none;">
                                                    <div class="form-group">
                                                        <label for="permalink" class="form-label">Permalink <span
                                                                class="text-danger">*</span></label>
                                                        <div class="input-group">
                                                            <span class="input-group-text" id="base-url">
                                                                https://testing.houselink360.com/projects/details/
                                                            </span>
                                                            <input type="text" class="form-control" id="permalink"
                                                                name="permalink"
                                                                value="{{ old('permalink', $property->permalink ?? '') }}">
                                                        </div>
                                                        <small class="form-text text-muted">
                                                            Preview:
                                                            <span id="full-preview">
                                                                https://testing.houselink360.com/projects/details/{{ old('permalink', $property->permalink ?? '') }}
                                                            </span>
                                                        </small>
                                                        <div id="permalink-note" class="text-info mt-2"
                                                            style="display: none;">
                                                            <i class="fas fa-info-circle"></i>
                                                            For Consultant accounts, permalink will not be stored.
                                                        </div>

                                                        @error('permalink')
                                                            <span class="text-danger">{{ $message }}</span>
                                                        @enderror
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="description">Description <span
                                                            class="text-danger">*</span></label>
                                                    <textarea class="form-control" name="description" id="description" rows="5" required>{{ old('description', $property->description) }}</textarea>
                                                    <div id="description_error" class="text-danger dynamic-error"></div>
                                                    @error('description')
                                                        <span class="text-danger">{{ $message }}</span>
                                                    @enderror
                                                </div>

                                                <div class="row">
                                                    <div class="col-md-6 mb-3" id="house_type_wrapper">
                                                        <label class="form-label">House Type <span
                                                                class="text-danger">*</span></label>
                                                        <select class="form-select" name="house_type">
                                                            <option value="">Select Type</option>
                                                            <option value="1RK"
                                                                {{ old('house_type', $property->house_type) == '1RK' ? 'selected' : '' }}>
                                                                1RK</option>
                                                            <option value="1BHK"
                                                                {{ old('house_type', $property->house_type) == '1BHK' ? 'selected' : '' }}>
                                                                1BHK</option>
                                                            <option value="2BHK"
                                                                {{ old('house_type', $property->house_type) == '2BHK' ? 'selected' : '' }}>
                                                                2BHK</option>
                                                            <option value="3BHK"
                                                                {{ old('house_type', $property->house_type) == '3BHK' ? 'selected' : '' }}>
                                                                3BHK</option>
                                                            <option value="4BHK"
                                                                {{ old('house_type', $property->house_type) == '4BHK' ? 'selected' : '' }}>
                                                                4BHK</option>
                                                            <option value="5BHK"
                                                                {{ old('house_type', $property->house_type) == '5BHK' ? 'selected' : '' }}>
                                                                5BHK</option>
                                                        </select>
                                                    </div>
                                                    @php
                                                        $currentCategory = $re_categorie->firstWhere(
                                                            'id',
                                                            $property->category_id,
                                                        );
                                                        $currentCategoryName = $currentCategory
                                                            ? strtolower($currentCategory->name)
                                                            : '';
                                                        $hideTenantPrefCategories = [
                                                            'plots',
                                                            'land',
                                                            'shop',
                                                            'building',
                                                            'godown',
                                                            'warehouse',
                                                            'office space',
                                                        ];
                                                        $showTenantPref = !in_array(
                                                            $currentCategoryName,
                                                            $hideTenantPrefCategories,
                                                        ) && ($property->property_for ?? 'sell') !== 'sell';
                                                    @endphp
                                                    <div class="col-md-4 {{ $showTenantPref ? 'd-flex' : 'd-none' }} d-flex-wrap mb-3"
                                                        id="tenant_preference_wrapper">
                                                        <div class="col-md-6 text-md-end text-start">
                                                            <label>Tenant Preference <span
                                                                    style="color:red">*</span></label>
                                                        </div>
                                                        <div class="col-md-10 justify-content-start">
                                                            @php
                                                                $rawPreferences = old(
                                                                    'tenant_preference',
                                                                    $property->tenant_preference ?? '',
                                                                );
                                                                if (is_array($rawPreferences)) {
                                                                    $savedPreferences = $rawPreferences;
                                                                } elseif (
                                                                    is_string($rawPreferences) &&
                                                                    !empty($rawPreferences)
                                                                ) {
                                                                    $savedPreferences = array_map(
                                                                        'trim',
                                                                        explode(',', $rawPreferences),
                                                                    );
                                                                } else {
                                                                    $savedPreferences = [];
                                                                }
                                                            @endphp
                                                            <div id="residential_tenant_prefs">
                                                                @foreach (['Family', 'Bachelor', 'Students', 'Working Professionals', 'Any'] as $label)
                                                                    <div class="form-check">
                                                                        <input type="checkbox" class="tenant-check"
                                                                            name="tenant_preference[]"
                                                                            value="{{ $label }}"
                                                                            id="pref_{{ Str::slug($label) }}"
                                                                            {{ in_array($label, $savedPreferences) ? 'checked' : '' }}>
                                                                        <label
                                                                            for="pref_{{ Str::slug($label) }}">{{ $label }}</label>
                                                                    </div>
                                                                @endforeach
                                                            </div>
                                                            <div id="commercial_tenant_prefs" style="display:none;">
                                                                @foreach (['Company', 'Any'] as $label)
                                                                    <div class="form-check">
                                                                        <input type="checkbox" class="tenant-check"
                                                                            name="tenant_preference[]"
                                                                            value="{{ $label }}"
                                                                            id="pref_comm_{{ Str::slug($label) }}"
                                                                            {{ in_array($label, $savedPreferences) ? 'checked' : '' }}>
                                                                        <label
                                                                            for="pref_comm_{{ Str::slug($label) }}">{{ $label }}</label>
                                                                    </div>
                                                                @endforeach
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4 mb-3" id="construction_age_wrapper">
                                                        <label class="form-label">Construction Age</label>
                                                        <select class="form-select" name="construction_age">
                                                            <option value="">Select Age</option>
                                                            <option value="New Construction"
                                                                {{ old('construction_age', $property->construction_age) == 'New Construction' ? 'selected' : '' }}>
                                                                New Construction</option>
                                                            <option value="Less than 1 year"
                                                                {{ old('construction_age', $property->construction_age) == 'Less than 1 year' ? 'selected' : '' }}>
                                                                Less than 1 year</option>
                                                            <option value="1-3 years"
                                                                {{ old('construction_age', $property->construction_age) == '1-3 years' ? 'selected' : '' }}>
                                                                1-3 years</option>
                                                            <option value="3-5 years"
                                                                {{ old('construction_age', $property->construction_age) == '3-5 years' ? 'selected' : '' }}>
                                                                3-5 years</option>
                                                            <option value="5-10 years"
                                                                {{ old('construction_age', $property->construction_age) == '5-10 years' ? 'selected' : '' }}>
                                                                5-10 years</option>
                                                            <option value="10+ years"
                                                                {{ old('construction_age', $property->construction_age) == '10+ years' ? 'selected' : '' }}>
                                                                10+ years</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    @php
                                                        $showBedBath  = in_array($savedSubtype, ['apartment', 'villa', 'individual_house']);
                                                        $showBathOnly = in_array($savedSubtype, ['shop', 'building', 'godown', 'warehouse', 'office_space']);
                                                    @endphp
                                                    <div class="col-md-4 mb-3" id="bedrooms-section" @if(!$showBedBath) style="display:none;" @endif>
                                                        <label class="form-label">Bedrooms <span
                                                                class="text-danger">*</span></label>
                                                        <input type="number" class="form-control" name="bedrooms"
                                                            id="bedrooms" min="0"
                                                            value="{{ old('bedrooms', $property->bedrooms ?? optional($extras->first())->bedrooms) }}">
                                                    </div>
                                                    <div class="col-md-4 mb-3" id="bathrooms-section" @if(!$showBedBath && !$showBathOnly) style="display:none;" @endif>
                                                        <label class="form-label">Bathrooms <span
                                                                class="text-danger">*</span></label>
                                                        <input type="number" class="form-control" name="bathrooms"
                                                            id="bathrooms" min="0"
                                                            value="{{ old('bathrooms', $property->bathrooms ?? optional($extras->first())->bathrooms) }}">
                                                    </div>
                                                    <div class="col-md-4 mb-3" id="balcony_wrapper">
                                                        <label class="form-label">Balcony</label>
                                                        <div class="d-flex gap-3 pt-2">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio"
                                                                    name="balcony" id="balcony_yes" value="Yes"
                                                                    {{ old('balcony', $property->balcony) == 'Yes' ? 'checked' : '' }}>
                                                                <label class="form-check-label"
                                                                    for="balcony_yes">Yes</label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio"
                                                                    name="balcony" id="balcony_no" value="No"
                                                                    {{ old('balcony', $property->balcony) == 'No' ? 'checked' : '' }}>
                                                                <label class="form-check-label"
                                                                    for="balcony_no">No</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id="villa-specific-fields" style="{{ in_array($savedSubtype, ['villa', 'individual_house']) ? '' : 'display: none;' }}"
                                                    class="mt-3 border p-3 rounded bg-light">
                                                    <div class="row">
                                                        <div class="col-md-6 mb-3">
                                                            <label class="form-label">Garden / Lawn</label>
                                                            <div class="d-flex gap-3">
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio"
                                                                        name="garden" id="garden_yes" value="Yes"
                                                                        {{ old('garden', $property->garden) == 'Yes' ? 'checked' : '' }}>
                                                                    <label class="form-check-label"
                                                                        for="garden_yes">Yes</label>
                                                                </div>
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio"
                                                                        name="garden" id="garden_no" value="No"
                                                                        {{ old('garden', $property->garden) == 'No' ? 'checked' : '' }}>
                                                                    <label class="form-check-label"
                                                                        for="garden_no">No</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label class="form-label">Swimming Pool</label>
                                                            <div class="d-flex gap-3">
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio"
                                                                        name="swimming_pool" id="pool_yes"
                                                                        value="Yes"
                                                                        {{ old('swimming_pool', $property->swimming_pool) == 'Yes' ? 'checked' : '' }}>
                                                                    <label class="form-check-label"
                                                                        for="pool_yes">Yes</label>
                                                                </div>
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio"
                                                                        name="swimming_pool" id="pool_no"
                                                                        value="No"
                                                                        {{ old('swimming_pool', $property->swimming_pool) == 'No' ? 'checked' : '' }}>
                                                                    <label class="form-check-label"
                                                                        for="pool_no">No</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div id="corner_property_wrapper" class="col-md-4 mb-3"
                                                        style="display:none;">
                                                        <label class="form-label">Corner Property</label>
                                                        <div class="d-flex gap-3 pt-2">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio"
                                                                    name="corner_property" id="corner_yes" value="Yes"
                                                                    {{ old('corner_property', $property->corner_property) == 'Yes' ? 'checked' : '' }}>
                                                                <label class="form-check-label"
                                                                    for="corner_yes">Yes</label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio"
                                                                    name="corner_property" id="corner_no" value="No"
                                                                    {{ old('corner_property', $property->corner_property) == 'No' ? 'checked' : '' }}>
                                                                <label class="form-check-label" for="corner_no">No</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div id="compound_wall_wrapper" class="col-md-4 mb-3"
                                                        style="display:none;">
                                                        <label class="form-label">Compound Wall</label>
                                                        <div class="d-flex gap-3 pt-2">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio"
                                                                    name="compound_wall" id="compound_yes" value="Yes"
                                                                    {{ old('compound_wall', $property->compound_wall) == 'Yes' ? 'checked' : '' }}>
                                                                <label class="form-check-label"
                                                                    for="compound_yes">Yes</label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio"
                                                                    name="compound_wall" id="compound_no" value="No"
                                                                    {{ old('compound_wall', $property->compound_wall) == 'No' ? 'checked' : '' }}>
                                                                <label class="form-check-label"
                                                                    for="compound_no">No</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div id="property_suitable_for_wrapper" class="col-md-6 mb-3"
                                                        style="display:none;">
                                                        <label class="form-label">Property Suitable For <span
                                                                class="text-danger">*</span></label>
                                                        <input type="text" class="form-control"
                                                            name="property_suitable_for"
                                                            placeholder="Eg: Food, Healthcare, Studio"
                                                            value="{{ old('property_suitable_for', $property->property_suitable_for) }}">
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    <div id="utility_area_wrapper" class="col-md-4 mb-3"
                                                        style="display:none;">
                                                        <label class="form-label">Utility Area</label>
                                                        <div class="d-flex gap-3 pt-2">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio"
                                                                    name="utility_area" id="utility_yes" value="Yes"
                                                                    {{ old('utility_area', $property->utility_area) == 'Yes' ? 'checked' : '' }}>
                                                                <label class="form-check-label"
                                                                    for="utility_yes">Yes</label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio"
                                                                    name="utility_area" id="utility_no" value="No"
                                                                    {{ old('utility_area', $property->utility_area) == 'No' ? 'checked' : '' }}>
                                                                <label class="form-check-label"
                                                                    for="utility_no">No</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div id="loading_unloading_wrapper" class="col-md-4 mb-3"
                                                        style="display:none;">
                                                        <label class="form-label">Loading / Unloading Facility</label>
                                                        <div class="d-flex gap-3 pt-2">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio"
                                                                    name="loading_unloading_facility" id="loading_yes"
                                                                    value="Yes"
                                                                    {{ old('loading_unloading_facility', $property->loading_unloading_facility) == 'Yes' ? 'checked' : '' }}>
                                                                <label class="form-check-label"
                                                                    for="loading_yes">Yes</label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio"
                                                                    name="loading_unloading_facility" id="loading_no"
                                                                    value="No"
                                                                    {{ old('loading_unloading_facility', $property->loading_unloading_facility) == 'No' ? 'checked' : '' }}>
                                                                <label class="form-check-label"
                                                                    for="loading_no">No</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div id="pantry_area_wrapper" class="col-md-4 mb-3"
                                                        style="display:none;">
                                                        <label class="form-label">Pantry Area</label>
                                                        <div class="d-flex gap-3 pt-2">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio"
                                                                    name="pantry_area" id="pantry_yes" value="Yes"
                                                                    {{ old('pantry_area', $property->pantry_area) == 'Yes' ? 'checked' : '' }}>
                                                                <label class="form-check-label"
                                                                    for="pantry_yes">Yes</label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio"
                                                                    name="pantry_area" id="pantry_no" value="No"
                                                                    {{ old('pantry_area', $property->pantry_area) == 'No' ? 'checked' : '' }}>
                                                                <label class="form-check-label" for="pantry_no">No</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id="key_specifications_wrapper" class="col-md-12 mb-3"
                                                    style="display:none;">
                                                    <div class="card">
                                                        <div class="card-header bg-secondary text-white">Key Specifications
                                                        </div>
                                                        <div class="card-body" id="keySpecificationsContainer">
                                                            @php
                                                                $keySpecsRaw = old('key_specifications', $property->key_specifications ?? '');
                                                                $keySpecs = $keySpecsRaw ? array_values(array_filter(array_map('trim', explode(',', $keySpecsRaw)))) : [''];
                                                            @endphp
                                                            @foreach ($keySpecs as $index => $spec)
                                                                <div class="row key-specification-row mb-2">
                                                                    <div class="col-md-10">
                                                                        <input type="text" class="form-control"
                                                                            name="key_specifications[]"
                                                                            placeholder="Eg: 1st Floor, Parking, Lift"
                                                                            value="{{ $spec }}">
                                                                    </div>
                                                                    <div class="col-md-2">
                                                                        <button type="button"
                                                                            class="btn btn-outline-dark"
                                                                            onclick="removeRow(this)"><i
                                                                                class="fa fa-trash"></i></button>
                                                                    </div>
                                                                </div>
                                                            @endforeach
                                                        </div>
                                                        <div
                                                            class="container d-flex justify-content-between align-items-center mb-2">
                                                            <button type="button" class="btn btn-outline-dark mt-2"
                                                                onclick="addSpecification()"><i class="fa fa-plus"></i>
                                                                Add Specification</button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    @php
                                                        $rawOwnership = old('ownership_type', $property->ownership_type ?? '');
                                                        $ownershipNormMap = [
                                                            'fully_owned'      => 'Fully Owned',
                                                            'on_lease'         => 'On Lease',
                                                            'shared_ownership' => 'Shared Ownership',
                                                            'company_owned'    => 'Company Owned',
                                                        ];
                                                        $normalizedOwnership = $ownershipNormMap[$rawOwnership] ?? $rawOwnership;
                                                    @endphp
                                                    <div class="col-md-4 mb-3">
                                                        <label class="form-label">Ownership <span
                                                                class="text-danger">*</span></label>
                                                        <select class="form-select" name="ownership_type">
                                                            <option value="">Select</option>
                                                            <option value="Fully Owned"
                                                                {{ $normalizedOwnership == 'Fully Owned' ? 'selected' : '' }}>
                                                                Fully Owned</option>
                                                            <option value="On Lease"
                                                                {{ $normalizedOwnership == 'On Lease' ? 'selected' : '' }}>
                                                                On Lease</option>
                                                            <option value="Shared Ownership"
                                                                {{ $normalizedOwnership == 'Shared Ownership' ? 'selected' : '' }}>
                                                                Shared Ownership</option>
                                                            <option value="Company Owned"
                                                                {{ $normalizedOwnership == 'Company Owned' ? 'selected' : '' }}>
                                                                Company Owned</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-4 mb-3" id="furnishing_wrapper">
                                                        <label class="form-label">Furnishing <span
                                                                class="text-danger">*</span></label>
                                                        <select class="form-select" name="furnishing_type">
                                                            <option value="">Select</option>
                                                            <option value="Furnished"
                                                                {{ old('furnishing_type', $property->furnishing_type) == 'Furnished' ? 'selected' : '' }}>
                                                                Furnished</option>
                                                            <option value="Semi-Furnished"
                                                                {{ old('furnishing_type', $property->furnishing_type) == 'Semi-Furnished' ? 'selected' : '' }}>
                                                                Semi-Furnished</option>
                                                            <option value="Unfurnished"
                                                                {{ old('furnishing_type', $property->furnishing_type) == 'Unfurnished' ? 'selected' : '' }}>
                                                                Unfurnished</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-4 mb-3" id="water_supply_wrapper">
                                                        <label class="form-label">Water Supply</label>
                                                        <select class="form-select" name="water_supply">
                                                            <option value="">Select</option>
                                                            <option value="Borewell"
                                                                {{ old('water_supply', $property->water_supply) == 'Borewell' ? 'selected' : '' }}>
                                                                Borewell</option>
                                                            <option value="Corporation"
                                                                {{ old('water_supply', $property->water_supply) == 'Corporation' ? 'selected' : '' }}>
                                                                Corporation</option>
                                                            <option value="Both"
                                                                {{ old('water_supply', $property->water_supply) == 'Both' ? 'selected' : '' }}>
                                                                Both</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    <div class="col-md-4 mb-3" id="food_preference_wrapper">
                                                        <label class="form-label">Food Preference <span
                                                                class="text-danger">*</span></label>
                                                        <select class="form-select" name="food_preference">
                                                            <option value="">Select</option>
                                                            <option value="Veg"
                                                                {{ old('food_preference', $property->food_preference) == 'Veg' ? 'selected' : '' }}>
                                                                Veg</option>
                                                            <option value="Non-Veg"
                                                                {{ old('food_preference', $property->food_preference) == 'Non-Veg' ? 'selected' : '' }}>
                                                                Non-Veg</option>
                                                            <option value="No Restrictions"
                                                                {{ old('food_preference', $property->food_preference) == 'No Restrictions' ? 'selected' : '' }}>
                                                                No Restrictions</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-4 mb-3" id="pet_policy_wrapper">
                                                        <label class="form-label">Pet Policy <span
                                                                class="text-danger">*</span></label>
                                                        <div class="d-flex gap-3 pt-2">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio"
                                                                    name="pet_policy" id="pet_allowed" value="Allowed"
                                                                    {{ old('pet_policy', $property->pet_policy) == 'Allowed' ? 'checked' : '' }}>
                                                                <label class="form-check-label"
                                                                    for="pet_allowed">Allowed</label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio"
                                                                    name="pet_policy" id="pet_not_allowed"
                                                                    value="Not Allowed"
                                                                    {{ old('pet_policy', $property->pet_policy) == 'Not Allowed' ? 'checked' : '' }}>
                                                                <label class="form-check-label" for="pet_not_allowed">Not
                                                                    Allowed</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="card mb-3 bg-light border-0" id="parking_card">
                                                    <div class="card-body py-3">
                                                        <div class="row align-items-center">
                                                            <div class="col-md-4">
                                                                <label class="form-label">Parking Availability</label>
                                                                <div class="d-flex gap-3 pt-2">
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio"
                                                                            name="parking_availability" id="parking_yes"
                                                                            value="Yes"
                                                                            {{ old('parking_availability', $property->parking_availability) == 'Yes' ? 'checked' : '' }}
                                                                            onclick="toggleParkingSection(true)">
                                                                        <label class="form-check-label"
                                                                            for="parking_yes">Yes</label>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio"
                                                                            name="parking_availability" id="parking_no"
                                                                            value="No"
                                                                            {{ old('parking_availability', $property->parking_availability) == 'No' ? 'checked' : '' }}
                                                                            onclick="toggleParkingSection(false)">
                                                                        <label class="form-check-label"
                                                                            for="parking_no">No</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-8" id="parking_type_div"
                                                                style="display: {{ old('parking_availability', $property->parking_availability) == 'Yes' ? 'block' : 'none' }};">
                                                                <div class="row align-items-center">
                                                                    <div class="col-md-6">
                                                                        <label class="form-label">Parking Type</label>
                                                                        <div class="d-flex gap-3 pt-2">
                                                                            <div class="form-check">
                                                                                <input class="form-check-input"
                                                                                    type="radio" name="parking_type"
                                                                                    id="parking_bike" value="Bike"
                                                                                    {{ old('parking_type', $property->parking_type) == 'Bike' ? 'checked' : '' }}
                                                                                    onclick="toggleSlotInput(true)">
                                                                                <label class="form-check-label"
                                                                                    for="parking_bike">Bike</label>
                                                                            </div>
                                                                            <div class="form-check">
                                                                                <input class="form-check-input"
                                                                                    type="radio" name="parking_type"
                                                                                    id="parking_car" value="Car"
                                                                                    {{ old('parking_type', $property->parking_type) == 'Car' ? 'checked' : '' }}
                                                                                    onclick="toggleSlotInput(true)">
                                                                                <label class="form-check-label"
                                                                                    for="parking_car">Car</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-md-6" id="parking_slots_wrapper"
                                                                        style="display: {{ old('parking_availability', $property->parking_availability) == 'Yes' ? 'block' : 'none' }};">
                                                                        <label class="form-label">No. of Slots</label>
                                                                        <input type="number" class="form-control"
                                                                            name="parking_slots_count"
                                                                            id="parking_slots_count" placeholder=""
                                                                            value="{{ old('parking_slots_count', $property->parking_slots_count) }}">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mb-4 mt-4 p-3 bg-white rounded border"
                                                    id="rent_lease_toggle_section"
                                                    style="display: {{ in_array(old('property_for', $property->property_for), ['rent', 'lease']) ? 'block' : 'none' }};">
                                                    <label class="form-label d-block fw-bold mb-2">Are you going to ...
                                                        <span class="text-danger">*</span></label>
                                                    <div class="d-flex flex-wrap gap-3">
                                                        <div class="form-check form-check-inline">
                                                            <input type="radio" class="form-check-input"
                                                                name="rent_lease_type" id="rent_type" value="rent"
                                                                {{ old('property_for', $property->property_for) == 'rent' ? 'checked' : '' }}
                                                                onchange="updateRentLeaseType()">
                                                            <label class="form-check-label" for="rent_type">Rent</label>
                                                        </div>
                                                        <div class="form-check form-check-inline">
                                                            <input type="radio" class="form-check-input"
                                                                name="rent_lease_type" id="lease_type" value="lease"
                                                                {{ old('property_for', $property->property_for) == 'lease' ? 'checked' : '' }}
                                                                onchange="updateRentLeaseType()">
                                                            <label class="form-check-label" for="lease_type">Lease</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="card mb-3 shadow-sm">
                                                    <div class="card-header fw-bold">Financial Details</div>
                                                    <div class="card-body">
                                                        <div class="row mb-4 align-items-end">
                                                            <div class="col-md-6">
                                                                <label class="form-label" id="price_label">Price <span
                                                                        class="text-danger">*</span></label>
                                                                <input type="text" class="form-control price-input"
                                                                    name="price" id="price" maxlength="17"
                                                                    value="{{ old('price', (int) $property->price) }}"
                                                                    required
                                                                    oninput="enforcePriceMax(this); convertPriceToText(this.value.replace(/,/g,''), 'price_in_words_input')">
                                                            </div>
                                                            <div class="col-md-6">
                                                                <label class="form-label text-muted small">Amount in
                                                                    Words</label>
                                                                <input type="text"
                                                                    class="form-control bg-light border-0"
                                                                    id="price_in_words_input" readonly>
                                                            </div>
                                                        </div>
                                                        @php
                                                            $propertyForValue = old(
                                                                'property_for',
                                                                $property->property_for ?? 'sell',
                                                            );
                                                            $securityDepositType = old(
                                                                'security_deposit_type',
                                                                $property->security_deposit_type,
                                                            );
                                                            $securityDepositAmount = old(
                                                                'security_deposit',
                                                                $property->security_deposit,
                                                            );
                                                            if (
                                                                empty($securityDepositType) &&
                                                                !empty($securityDepositAmount)
                                                            ) {
                                                                $securityDepositType = 'Fixed';
                                                            }
                                                            $showSecurityAmount = $securityDepositType == 'Fixed';
                                                        @endphp
                                                        <div class="row mb-4 align-items-end"
                                                            id="security_deposit_section"
                                                            style="display: {{ in_array($propertyForValue, ['rent', 'lease']) ? 'flex' : 'none' }};">
                                                            <div class="col-md-6">
                                                                <label class="form-label">Security Deposit <span
                                                                        class="text-danger">*</span></label>
                                                                <div class="d-flex gap-3 mb-2">
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio"
                                                                            name="security_deposit_type" id="sec_fixed"
                                                                            value="Fixed"
                                                                            {{ $securityDepositType == 'Fixed' ? 'checked' : '' }}
                                                                            onclick="toggleSecurityDepositInput('Fixed')">
                                                                        <label class="form-check-label"
                                                                            for="sec_fixed">Fixed</label>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio"
                                                                            name="security_deposit_type"
                                                                            id="sec_negotiable" value="Negotiable"
                                                                            {{ $securityDepositType == 'Negotiable' ? 'checked' : '' }}
                                                                            onclick="toggleSecurityDepositInput('Negotiable')">
                                                                        <label class="form-check-label"
                                                                            for="sec_negotiable">Negotiable</label>
                                                                    </div>
                                                                </div>
                                                                <input type="text" class="form-control price-input"
                                                                    name="security_deposit" id="security_deposit_amount"
                                                                    placeholder="Enter Amount"
                                                                    value="{{ $securityDepositAmount }}"
                                                                    maxlength="17"
                                                                    style="display: {{ $showSecurityAmount ? 'block' : 'none' }};"
                                                                    oninput="formatIndianPrice(this); convertPriceToText(this.value.replace(/,/g,''), 'security_deposit_words_input')">
                                                            </div>
                                                            <div class="col-md-6" id="security_deposit_words_div"
                                                                style="display: {{ $showSecurityAmount ? 'block' : 'none' }};">
                                                                <label class="form-label text-muted small">Amount in
                                                                    Words</label>
                                                                <input type="text"
                                                                    class="form-control bg-light border-0"
                                                                    id="security_deposit_words_input" readonly>
                                                            </div>
                                                        </div>
                                                        <div class="row mb-4 align-items-end" id="maintenance_section"
                                                            style="display: {{ in_array($propertyForValue, ['rent', 'lease']) ? 'flex' : 'none' }};">
                                                            <div class="col-md-6">
                                                                <label class="form-label">Maintenance Charge <span
                                                                        class="text-danger">*</span></label>
                                                                <div class="d-flex gap-3 mb-2">
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio"
                                                                            name="maintenance_charge_status"
                                                                            id="maint_yes" value="Yes"
                                                                            {{ old('maintenance_charge_status', $property->maintenance_charge_status) == 'Yes' ? 'checked' : '' }}
                                                                            onclick="toggleMaintenance(true)">
                                                                        <label class="form-check-label"
                                                                            for="maint_yes">Yes</label>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio"
                                                                            name="maintenance_charge_status"
                                                                            id="maint_no" value="No"
                                                                            {{ old('maintenance_charge_status', $property->maintenance_charge_status) == 'No' ? 'checked' : '' }}
                                                                            onclick="toggleMaintenance(false)">
                                                                        <label class="form-check-label"
                                                                            for="maint_no">No</label>
                                                                    </div>
                                                                </div>
                                                                <input type="text" class="form-control price-input"
                                                                    name="maintenance_charge_amount"
                                                                    id="maintenance_amount_input"
                                                                    placeholder="Enter Amount"
                                                                    value="{{ old('maintenance_charge_amount', $property->maintenance_charge_amount) }}"
                                                                    maxlength="17"
                                                                    style="display: {{ old('maintenance_charge_status', $property->maintenance_charge_status) == 'Yes' ? 'block' : 'none' }};"
                                                                    oninput="formatIndianPrice(this); convertPriceToText(this.value.replace(/,/g,''), 'maintenance_charge_words_input')">
                                                            </div>
                                                            <div class="col-md-6" id="maintenance_words_div"
                                                                style="display: {{ old('maintenance_charge_status', $property->maintenance_charge_status) == 'Yes' ? 'block' : 'none' }};">
                                                                <label class="form-label text-muted small">Amount in
                                                                    Words</label>
                                                                <input type="text"
                                                                    class="form-control bg-light border-0"
                                                                    id="maintenance_charge_words_input" readonly>
                                                            </div>
                                                        </div>
                                                        <div id="lease_specific_fields"
                                                            style="display: {{ old('property_for', $property->property_for) == 'lease' ? 'block' : 'none' }};">
                                                            <div class="row mb-3">
                                                                <div class="col-md-6">
                                                                    <label class="form-label">Lease Duration <span
                                                                            class="text-danger">*</span></label>
                                                                    <select class="form-select" name="lease_duration"
                                                                        id="lease_duration">
                                                                        <option value="">Select Duration</option>
                                                                        <option value="1 year"
                                                                            {{ old('lease_duration', $property->lease_duration) == '1 year' ? 'selected' : '' }}>
                                                                            1 Year</option>
                                                                        <option value="2 years"
                                                                            {{ old('lease_duration', $property->lease_duration) == '2 years' ? 'selected' : '' }}>
                                                                            2 Years</option>
                                                                        <option value="3 years"
                                                                            {{ old('lease_duration', $property->lease_duration) == '3 years' ? 'selected' : '' }}>
                                                                            3 Years</option>
                                                                        <option value="> 3 years"
                                                                            {{ old('lease_duration', $property->lease_duration) == '> 3 years' ? 'selected' : '' }}>
                                                                            > 3 Years</option>
                                                                    </select>
                                                                </div>
                                                                <div class="col-md-6">
                                                                    <label class="form-label">Maintenance Responsibility
                                                                        <span class="text-danger">*</span></label>
                                                                    <select class="form-select"
                                                                        name="maintenance_responsibility"
                                                                        id="maintenance_responsibility">
                                                                        <option value="">Select</option>
                                                                        <option value="Tenant"
                                                                            {{ old('maintenance_responsibility', $property->maintenance_responsibility) == 'Tenant' ? 'selected' : '' }}>
                                                                            Tenant</option>
                                                                        <option value="Owner"
                                                                            {{ old('maintenance_responsibility', $property->maintenance_responsibility) == 'Owner' ? 'selected' : '' }}>
                                                                            Owner</option>
                                                                        <option value="Shared"
                                                                            {{ old('maintenance_responsibility', $property->maintenance_responsibility) == 'Shared' ? 'selected' : '' }}>
                                                                            Shared</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-md-6 mb-3" id="notice_period_section"
                                                                style="display: {{ in_array($propertyForValue, ['rent', 'lease']) ? 'block' : 'none' }};">
                                                                <label class="form-label">Notice Period</label>
                                                                <select class="form-select" name="notice_period"
                                                                    id="notice_period">
                                                                    <option value="">Select Period</option>
                                                                    <option value="No-notice"
                                                                        {{ old('notice_period', $property->notice_period) == 'No-notice' ? 'selected' : '' }}>
                                                                        No-notice</option>
                                                                    <option value="1 Month"
                                                                        {{ old('notice_period', $property->notice_period) == '1 Month' ? 'selected' : '' }}>
                                                                        1 Month</option>
                                                                    <option value="2 Months"
                                                                        {{ old('notice_period', $property->notice_period) == '2 Months' ? 'selected' : '' }}>
                                                                        2 Months</option>
                                                                    <option value="3 Months"
                                                                        {{ old('notice_period', $property->notice_period) == '3 Months' ? 'selected' : '' }}>
                                                                        3 Months</option>
                                                                    <option value="6 Months"
                                                                        {{ old('notice_period', $property->notice_period) == '6 Months' ? 'selected' : '' }}>
                                                                        6 Months</option>
                                                                </select>
                                                            </div>
                                                            <div class="col-md-6 mb-3">
                                                                <label class="form-label">Availability <span
                                                                        class="text-danger">*</span></label>
                                                                <select class="form-select mb-2"
                                                                    name="availability_status" id="availability_status"
                                                                    onchange="toggleAvailabilityDate()">
                                                                    <option value="Ready to occupy"
                                                                        {{ old('availability_status', $property->availability_status) == 'Ready to occupy' ? 'selected' : '' }}>
                                                                        Ready to Occupy</option>
                                                                    <option value="Available From"
                                                                        {{ old('availability_status', $property->availability_status) == 'Available From' ? 'selected' : '' }}>
                                                                        Available From</option>
                                                                </select>
                                                                <input type="date" class="form-control"
                                                                    name="availability_date" id="availability_date"
                                                                    value="{{ old('availability_date', $property->availability_date) }}"
                                                                    style="display: {{ old('availability_status', $property->availability_status) == 'Available From' ? 'block' : 'none' }};">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="card mt-4 shadow-sm">
                                                    <div class="card-header bg-light">
                                                        <h6 class="mb-0">Images <small class="text-muted">(Max 2MB
                                                                each)</small> - <span id="image-limit-text"
                                                                class="badge bg-primary">Up to 15</span></h6>
                                                    </div>
                                                    <div class="card-body">
                                                        <div class="form-group">
                                                            <input type="file" class="form-control" name="images[]"
                                                                id="images" multiple
                                                                accept="image/jpeg,image/jpg,image/png"
                                                                data-max-files="15">
                                                            <div id="existingImagePreviewContainer"
                                                                class="d-flex flex-wrap mt-3">
                                                                @foreach ($property->images as $image)
                                                                    <div class="image-preview"
                                                                        id="image-{{ $image->id }}">
                                                                        <img src="{{ asset($image->image_url) }}"
                                                                            alt="Property Image" class="img-thumbnail"
                                                                            width="100">
                                                                        <button type="button" class="remove-btn"
                                                                            onclick="deleteImage({{ $image->id }})">×</button>
                                                                        <input type="hidden" name="deleted_image_ids[]"
                                                                            id="delete-image-{{ $image->id }}"
                                                                            value="" disabled>
                                                                    </div>
                                                                @endforeach
                                                            </div>
                                                            <div id="newImagePreviewContainer"
                                                                class="d-flex flex-wrap mt-3"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="card mt-4 shadow-sm" id="autoRenewalCard" style="{{ in_array($property->property_for, ['rent', 'lease']) ? 'display:none;' : '' }}">
                                                    <div class="card-header bg-light">
                                                        <h6 class="mb-0">Auto-Renewal Options</h6>
                                                    </div>
                                                    <div class="card-body">
                                                        <div class="row">
                                                            <div class="col-md-6 mb-2">
                                                                <div class="form-check">
                                                                    <input type="hidden" name="renew_24_hours"
                                                                        value="0">
                                                                    <input type="checkbox" class="form-check-input"
                                                                        name="renew_24_hours" id="renew_24_hours"
                                                                        value="1"
                                                                        {{ old('renew_24_hours', $property->renew_24_hours) ? 'checked' : '' }}>
                                                                    <label class="form-check-label"
                                                                        for="renew_24_hours">Renew automatically every 24 hours?</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-6 mb-2">
                                                                <div class="form-check">
                                                                    <input type="hidden" name="renew_30_days"
                                                                        value="0">
                                                                    <input type="checkbox" class="form-check-input"
                                                                        name="renew_30_days" id="renew_30_days"
                                                                        value="1"
                                                                        {{ old('renew_30_days', $property->renew_30_days) ? 'checked' : '' }}>
                                                                    <label class="form-check-label"
                                                                        for="renew_30_days">Renew automatically every 30
                                                                        days?</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <script>
                                                document.addEventListener('DOMContentLoaded', function() {
                                                    document.body.addEventListener('change', function(e) {
                                                        const input = e.target;
                                                        if (input.type !== 'radio') return;

                                                        const name = input.name;
                                                        document.querySelectorAll('input[type="radio"][name="' + name + '"]').forEach(r => {
                                                            const card = r.closest('.custom-radio-card');
                                                            if (card) card.classList.remove('active');
                                                        });

                                                        const activeCard = input.closest('.custom-radio-card');
                                                        if (activeCard) activeCard.classList.add('active');
                                                    });
                                                });
                                            </script>

                                            <script>
                                                (function() {
                                                    function applyLandStep2() {
                                                        const subtype = document.getElementById('property_subtype')?.value;
                                                        if (!['plot', 'land', 'land_lease'].includes(subtype)) return;
                                                        [
                                                            'balcony',
                                                            'bedrooms',
                                                            'bathrooms',
                                                            'garden',
                                                            'swimming_pool',
                                                            'utility_area',
                                                            'loading_unloading_facility',
                                                            'pantry_area',
                                                            'parking_availability',
                                                            'parking_type',
                                                            'parking_slots_count',
                                                            'pet_policy'
                                                        ].forEach(name => {
                                                            document.querySelectorAll(`[name="${name}"]`).forEach(el => {
                                                                el.closest('.col-md-4, .col-md-6, .col-md-12')
                                                                    ?.style.setProperty('display', 'none', 'important');
                                                            });
                                                        });

                                                        [
                                                            'balcony_wrapper',
                                                            'villa-specific-fields',
                                                            'utility_area_wrapper',
                                                            'loading_unloading_wrapper',
                                                            'pantry_area_wrapper',
                                                            'key_specifications_wrapper',
                                                            'parking_card',
                                                            'parking_type_div',
                                                            'parking_slots_wrapper'
                                                        ].forEach(id => {
                                                            const el = document.getElementById(id);
                                                            if (el) el.style.setProperty('display', 'none', 'important');
                                                        });

                                                        const fieldsToHide = ['construction_age', 'furnishing_type', 'water_supply', 'food_preference', 'house_type'];
                                                        fieldsToHide.forEach(name => {
                                                            const el = document.querySelector(`[name="${name}"]`);
                                                            if (el) el.closest('.col-md-4, .col-md-6')
                                                                ?.style.setProperty('display', 'none', 'important');
                                                        });

                                                        [
                                                            'corner_property_wrapper',
                                                            'compound_wall_wrapper'
                                                        ].forEach(id => {
                                                            const el = document.getElementById(id);
                                                            if (el) el.style.setProperty('display', '', 'important');
                                                        });

                                                        const resGroup = document.getElementById('residential_tenant_prefs');
                                                        const commGroup = document.getElementById('commercial_tenant_prefs');
                                                        if (resGroup) resGroup.style.display = 'none';
                                                        if (commGroup) commGroup.style.display = 'block';
                                                        const ownership = document.querySelector('[name="ownership_type"]');
                                                        if (ownership) {
                                                            ownership.closest('.col-md-4')?.style.setProperty('display', '');
                                                            const companyOwnedOpt = ownership.querySelector('option[value="Company Owned"]');
                                                            if (companyOwnedOpt) {
                                                                if (subtype === 'plot') {
                                                                    companyOwnedOpt.style.display = 'none';
                                                                    if (ownership.value === 'Company Owned') ownership.value = '';
                                                                } else {
                                                                    companyOwnedOpt.style.display = '';
                                                                }
                                                            }
                                                        }
                                                    }

                                                    document.addEventListener('DOMContentLoaded', applyLandStep2);
                                                    document.addEventListener('change', () => setTimeout(applyLandStep2, 0));
                                                    document.addEventListener('click', () => setTimeout(applyLandStep2, 0));
                                                })();
                                            </script>

                                            <script>
                                                (function() {
                                                    function applyShopStep2() {
                                                        const subtype = document.getElementById('property_subtype')?.value;
                                                        if (subtype !== 'shop') return;
                                                        [
                                                            'balcony',
                                                            'bedrooms',
                                                            'garden',
                                                            'swimming_pool',
                                                            'compound_wall',
                                                            'pantry_area',
                                                            'pet_policy'
                                                        ].forEach(name => {
                                                            document.querySelectorAll(`[name="${name}"]`).forEach(el => {
                                                                el.closest('.col-md-4, .col-md-6, .col-md-12')
                                                                    ?.style.setProperty('display', 'none', 'important');
                                                            });
                                                        });

                                                        [
                                                            'balcony_wrapper',
                                                            'villa-specific-fields',
                                                            'compound_wall_wrapper',
                                                            'pantry_area_wrapper'
                                                        ].forEach(id => {
                                                            const el = document.getElementById(id);
                                                            if (el) el.style.setProperty('display', 'none', 'important');
                                                        });

                                                        const shopParkingCard = document.getElementById('parking_card');
                                                        if (shopParkingCard) shopParkingCard.style.setProperty('display', '', 'important');
                                                        document.querySelectorAll('input[name="parking_availability"]').forEach(el => {
                                                            const wrapper = el.closest('.col-md-4, .col-md-6');
                                                            if (wrapper) wrapper.style.setProperty('display', '', 'important');
                                                        });
                                                        const shopParkingTypeDiv = document.getElementById('parking_type_div');
                                                        const shopParkingSlotsWrapper = document.getElementById('parking_slots_wrapper');
                                                        const shopParkingYesChecked = document.querySelector('input[name="parking_availability"][value="Yes"]')?.checked;
                                                        if (shopParkingTypeDiv) shopParkingTypeDiv.style.setProperty('display', shopParkingYesChecked ? 'block' : 'none', 'important');
                                                        if (shopParkingSlotsWrapper) shopParkingSlotsWrapper.style.setProperty('display', shopParkingYesChecked ? 'block' : 'none', 'important');

                                                        [
                                                            'house_type',
                                                            'construction_age',
                                                            'furnishing_type',
                                                            'water_supply',
                                                            'food_preference'
                                                        ].forEach(name => {
                                                            const el = document.querySelector(`[name="${name}"]`);
                                                            if (el) el.closest('.col-md-4, .col-md-6')
                                                                ?.style.setProperty('display', 'none', 'important');
                                                        });

                                                        document.querySelectorAll('input[name="pet_policy"]')
                                                            .forEach(r => r.closest('.col-md-4')
                                                                ?.style.setProperty('display', 'none', 'important'));

                                                        [
                                                            'tenant_preference_wrapper',
                                                            'corner_property_wrapper',
                                                            'property_suitable_for_wrapper',
                                                            'utility_area_wrapper',
                                                            'loading_unloading_wrapper',
                                                            'key_specifications_wrapper'
                                                        ].forEach(id => {
                                                            const el = document.getElementById(id);
                                                            if (el) el.style.setProperty('display', '', 'important');
                                                        });

                                                        const ownership = document.querySelector('[name="ownership_type"]');
                                                        if (ownership) ownership.closest('.col-md-4')?.style.setProperty('display', '');

                                                        // Keep bathrooms visible for shop
                                                        const bathroomsSection = document.getElementById('bathrooms-section');
                                                        if (bathroomsSection) bathroomsSection.style.setProperty('display', '', 'important');
                                                    }

                                                    document.addEventListener('DOMContentLoaded', applyShopStep2);
                                                    document.addEventListener('change', () => setTimeout(applyShopStep2, 0));
                                                    document.addEventListener('click', () => setTimeout(applyShopStep2, 0));
                                                })();
                                            </script>

                                            <script>
                                                (function() {
                                                    function applyBuildingStep2() {
                                                        const subtype = document.getElementById('property_subtype')?.value;
                                                        if (subtype !== 'building') return;
                                                        [
                                                            'balcony',
                                                            'bedrooms',
                                                            'bathrooms',
                                                            'garden',
                                                            'swimming_pool',
                                                            'pantry_area',
                                                            'pet_policy'
                                                        ].forEach(name => {
                                                            document.querySelectorAll(`[name="${name}"]`).forEach(el => {
                                                                el.closest('.col-md-4, .col-md-6, .col-md-12')
                                                                    ?.style.setProperty('display', 'none', 'important');
                                                            });
                                                        });

                                                        [
                                                            'balcony_wrapper',
                                                            'villa-specific-fields',
                                                            'pantry_area_wrapper'
                                                        ].forEach(id => {
                                                            const el = document.getElementById(id);
                                                            if (el) el.style.setProperty('display', 'none', 'important');
                                                        });

                                                        [
                                                            'house_type',
                                                            'construction_age',
                                                            'furnishing_type',
                                                            'water_supply',
                                                            'food_preference'
                                                        ].forEach(name => {
                                                            const el = document.querySelector(`[name="${name}"]`);
                                                            if (el) el.closest('.col-md-4, .col-md-6')
                                                                ?.style.setProperty('display', 'none', 'important');
                                                        });

                                                        [
                                                            'tenant_preference_wrapper',
                                                            'corner_property_wrapper',
                                                            'property_suitable_for_wrapper',
                                                            'utility_area_wrapper',
                                                            'key_specifications_wrapper'
                                                        ].forEach(id => {
                                                            const el = document.getElementById(id);
                                                            if (el) el.style.setProperty('display', '', 'important');
                                                        });

                                                        // Parking is mandatory for Building — show and auto-select Yes
                                                        const parkingCard = document.getElementById('parking_card');
                                                        if (parkingCard) parkingCard.style.setProperty('display', '', 'important');
                                                        const parkingYesRadio = document.querySelector('input[name="parking_availability"][value="Yes"]');
                                                        if (parkingYesRadio && !parkingYesRadio.checked) {
                                                            parkingYesRadio.checked = true;
                                                        }
                                                        const parkingTypeDiv = document.getElementById('parking_type_div');
                                                        const parkingSlotsWrapper = document.getElementById('parking_slots_wrapper');
                                                        if (parkingTypeDiv) parkingTypeDiv.style.setProperty('display', 'block', 'important');
                                                        if (parkingSlotsWrapper) parkingSlotsWrapper.style.setProperty('display', 'block', 'important');
                                                    }

                                                    document.addEventListener('DOMContentLoaded', applyBuildingStep2);
                                                    document.addEventListener('change', () => setTimeout(applyBuildingStep2, 0));
                                                    document.addEventListener('click', () => setTimeout(applyBuildingStep2, 0));
                                                })();
                                            </script>

                                            <script>
                                                (function() {
                                                    function applyGodownWarehouseStep2() {
                                                        const subtype = document.getElementById('property_subtype')?.value;
                                                        if (!['godown', 'warehouse'].includes(subtype)) return;

                                                        [
                                                            'balcony',
                                                            'bedrooms',
                                                            'garden',
                                                            'swimming_pool',
                                                            'compound_wall',
                                                            'pantry_area',
                                                            'pet_policy'
                                                        ].forEach(name => {
                                                            document.querySelectorAll(`[name="${name}"]`).forEach(el => {
                                                                el.closest('.col-md-4, .col-md-6, .col-md-12')
                                                                    ?.style.setProperty('display', 'none', 'important');
                                                            });
                                                        });

                                                        // Keep bathrooms visible for godown/warehouse
                                                        const bathroomsSection = document.getElementById('bathrooms-section');
                                                        if (bathroomsSection) bathroomsSection.style.setProperty('display', '', 'important');

                                                        [
                                                            'balcony_wrapper',
                                                            'villa-specific-fields',
                                                            'compound_wall_wrapper',
                                                            'pantry_area_wrapper'
                                                        ].forEach(id => {
                                                            const el = document.getElementById(id);
                                                            if (el) el.style.setProperty('display', 'none', 'important');
                                                        });

                                                        [
                                                            'house_type',
                                                            'construction_age',
                                                            'furnishing_type',
                                                            'water_supply',
                                                            'food_preference'
                                                        ].forEach(name => {
                                                            const el = document.querySelector(`[name="${name}"]`);
                                                            if (el) el.closest('.col-md-4, .col-md-6')
                                                                ?.style.setProperty('display', 'none', 'important');
                                                        });

                                                        [
                                                            'tenant_preference_wrapper',
                                                            'corner_property_wrapper',
                                                            'property_suitable_for_wrapper',
                                                            'utility_area_wrapper',
                                                            'loading_unloading_wrapper',
                                                            'key_specifications_wrapper'
                                                        ].forEach(id => {
                                                            const el = document.getElementById(id);
                                                            if (el) el.style.setProperty('display', '', 'important');
                                                        });

                                                        const gwParkingCard = document.getElementById('parking_card');
                                                        if (gwParkingCard) gwParkingCard.style.setProperty('display', '', 'important');
                                                        document.querySelectorAll('input[name="parking_availability"]').forEach(el => {
                                                            const wrapper = el.closest('.col-md-4, .col-md-6');
                                                            if (wrapper) wrapper.style.setProperty('display', '', 'important');
                                                        });
                                                        const gwParkingTypeDiv = document.getElementById('parking_type_div');
                                                        const gwParkingSlotsWrapper = document.getElementById('parking_slots_wrapper');
                                                        const gwParkingYesChecked = document.querySelector('input[name="parking_availability"][value="Yes"]')?.checked;
                                                        if (gwParkingTypeDiv) gwParkingTypeDiv.style.setProperty('display', gwParkingYesChecked ? 'block' : 'none', 'important');
                                                        if (gwParkingSlotsWrapper) gwParkingSlotsWrapper.style.setProperty('display', gwParkingYesChecked ? 'block' : 'none', 'important');
                                                    }

                                                    document.addEventListener('DOMContentLoaded', applyGodownWarehouseStep2);
                                                    document.addEventListener('change', () => setTimeout(applyGodownWarehouseStep2, 0));
                                                    document.addEventListener('click', () => setTimeout(applyGodownWarehouseStep2, 0));
                                                })();
                                            </script>

                                            <script>
                                                (function() {
                                                    function applyOfficeSpaceStep2() {
                                                        const subtype = document.getElementById('property_subtype')?.value;
                                                        if (subtype !== 'office_space') return;

                                                        [
                                                            'balcony',
                                                            'bedrooms',
                                                            'garden',
                                                            'swimming_pool',
                                                            'compound_wall',
                                                            'pet_policy'
                                                        ].forEach(name => {
                                                            document.querySelectorAll(`[name="${name}"]`).forEach(el => {
                                                                el.closest('.col-md-4, .col-md-6, .col-md-12')
                                                                    ?.style.setProperty('display', 'none', 'important');
                                                            });
                                                        });

                                                        // Keep bathrooms visible for office_space
                                                        const bathroomsSection = document.getElementById('bathrooms-section');
                                                        if (bathroomsSection) bathroomsSection.style.setProperty('display', '', 'important');

                                                        [
                                                            'balcony_wrapper',
                                                            'villa-specific-fields',
                                                            'compound_wall_wrapper'
                                                        ].forEach(id => {
                                                            const el = document.getElementById(id);
                                                            if (el) el.style.setProperty('display', 'none', 'important');
                                                        });

                                                        [
                                                            'house_type',
                                                            'construction_age',
                                                            'water_supply',
                                                            'food_preference'
                                                        ].forEach(name => {
                                                            const el = document.querySelector(`[name="${name}"]`);
                                                            if (el) el.closest('.col-md-4, .col-md-6')
                                                                ?.style.setProperty('display', 'none', 'important');
                                                        });

                                                        [
                                                            'tenant_preference_wrapper',
                                                            'corner_property_wrapper',
                                                            'property_suitable_for_wrapper',
                                                            'utility_area_wrapper',
                                                            'loading_unloading_wrapper',
                                                            'pantry_area_wrapper',
                                                            'key_specifications_wrapper'
                                                        ].forEach(id => {
                                                            const el = document.getElementById(id);
                                                            if (el) el.style.setProperty('display', '', 'important');
                                                        });
                                                    }

                                                    document.addEventListener('DOMContentLoaded', applyOfficeSpaceStep2);
                                                    document.addEventListener('change', () => setTimeout(applyOfficeSpaceStep2, 0));
                                                    document.addEventListener('click', () => setTimeout(applyOfficeSpaceStep2, 0));
                                                })();
                                            </script>
                                            <div class="form-step d-none" id="step-3">
                                                <div class="row">
                                                    <div class="col-md-12 mb-4">
                                                        <label for="state">State <span class="text-danger">*</span>
                                                        </label>
                                                        <select class="form-control w-100" id="state"
                                                            name="state_id" required>
                                                            <option value="">Select State </option>
                                                            @foreach ($states as $state)
                                                                <option value="{{ $state->id }}"
                                                                    {{ old('state_id', $property->state_id) == $state->id ? 'selected' : '' }}>
                                                                    {{ $state->name }}
                                                                </option>
                                                            @endforeach
                                                        </select>
                                                        <div id="state_id_error" class="text-danger dynamic-error">
                                                        </div>
                                                        @error('state_id')
                                                            <span class="text-danger">{{ $message }}</span>
                                                        @enderror
                                                    </div>
                                                    <div class="col-md-12">
                                                        <div class="form-group">
                                                            <label for="city">City <span
                                                                    class="text-danger">*</span> </label>
                                                            <select class="form-control w-100" id="city"
                                                                name="city_id"
                                                                data-selected="{{ old('city_id', $property->city_id) }}"
                                                                required>
                                                                <option value="">Select City</option>
                                                            </select>
                                                            <div id="city_id_error" class="text-danger dynamic-error">
                                                            </div>
                                                            @error('city_id')
                                                                <span class="text-danger">{{ $message }}</span>
                                                            @enderror
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="location">Property Location <span
                                                            class="text-danger">*</span> </label>
                                                    <input class="form-control" id="location" name="location"
                                                        placeholder="Enter Property Location" rows="3"
                                                        maxlength="500"
                                                        value="{{ old('location', $property->location) }}" required>
                                                    <div id="location_error" class="text-danger dynamic-error"></div>
                                                    @error('location')
                                                        <span class="text-danger">{{ $message }}</span>
                                                    @enderror
                                                </div>



                                            </div>
                                            <div class="form-step d-none" id="step-4">
                                                <div class="card mt-2">
                                                    <div class="card-header">Nearby Key Facilities</div>
                                                    <div class="card-body">
                                                        <div id="facilitiesContainer">
                                                            @foreach ($property->facilities as $index => $facility)
                                                                <div class="row facility-row mb-2"
                                                                    id="facility-{{ $facility->id }}">
                                                                    <div class="col-md-5">
                                                                        <div class="form-group">
                                                                            <select class="form-control"
                                                                                name="facility_ids[]" required>
                                                                                <option value="">Select Facilities
                                                                                </option>
                                                                                @foreach ($product_cate as $item)
                                                                                    <option value="{{ $item->id }}"
                                                                                        {{ $facility->facility_id == $item->id ? 'selected' : '' }}>
                                                                                        {{ $item->name }}
                                                                                    </option>
                                                                                @endforeach
                                                                            </select>
                                                                            @error('facility_ids.' . $index)
                                                                                <span
                                                                                    class="text-danger">{{ $message }}</span>
                                                                            @enderror
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-md-5">
                                                                        <div class="form-group">
                                                                            <div class="position-relative mb-4">
                                                                                <input type="text"
                                                                                    class="form-control facility-value-input mb-1"
                                                                                    name="facility_values[]"
                                                                                    maxlength="50"
                                                                                    value="{{ old('facility_values.' . $index, $facility->facility_value) }}"
                                                                                    placeholder="Distance (E.g: 200m , 1km..) from here">
                                                                                <small class="char-counter text-muted"
                                                                                    style="position:absolute;right:10px;bottom:-20px;">50/50</small>
                                                                            </div>
                                                                            @error('facility_values.' . $index)
                                                                                <span
                                                                                    class="text-danger">{{ $message }}</span>
                                                                            @enderror
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-md-2">
                                                                        <button type="button"
                                                                            class="btn btn-outline-dark"
                                                                            onclick="removeRow(this, @json($facility->id))">
                                                                            <i class="fa-solid fa-trash"></i>
                                                                        </button>
                                                                    </div>
                                                                    <input type="hidden" name="deleted_facility_ids[]"
                                                                        id="delete-facility-{{ $facility->id }}"
                                                                        value="" disabled>
                                                                </div>
                                                            @endforeach
                                                        </div>
                                                        <button type="button" class="btn btn-outline-dark mt-3"
                                                            onclick="addNewRow()">Add New
                                                        </button>
                                                    </div>
                                                </div>

                                                <div class="card mt-2">
                                                    <div class="card-header">Features</div>
                                                    <div class="card-body">
                                                        <div class="row">
                                                            @foreach ($keyfeature as $item)
                                                                @php
                                                                    $isChecked = in_array(
                                                                        $item->keyid,
                                                                        old(
                                                                            'features',
                                                                            $property->features
                                                                                ->pluck('feature_id')
                                                                                ->toArray(),
                                                                        ),
                                                                    );
                                                                @endphp

                                                                <div
                                                                    class="form-group form-check col-md-3 mb-2 d-flex align-items-center">
                                                                    <input type="checkbox"
                                                                        class="form-check-input feature-checkbox"
                                                                        name="features[]" value="{{ $item->keyid }}"
                                                                        id="feature_{{ $item->keyid }}"
                                                                        {{ $isChecked ? 'checked' : '' }}
                                                                        style="position:absolute;opacity:0;display:none;">

                                                                    <label class="form-check-label ms-2"
                                                                        for="feature_{{ $item->keyid }}">
                                                                        {{ $item->keyfeatures_name }} <span class="tick-icon" style="display: {{ $isChecked ? 'inline' : 'none' }};">✓</span>
                                                                    </label>
                                                                </div>
                                                            @endforeach

                                                            @error('features')
                                                                <span class="text-danger">{{ $message }}</span>
                                                            @enderror
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group mt-4 p-3 rounded" id="direction-facing-group">
                                                    <label for="direction_facing" class="mb-2">Direction Facing <span
                                                            id="direction-facing-asterisk" class="text-danger"
                                                            style="display:none">*</span></label>
                                                    <select class="form-control" name="direction_facing"
                                                        id="direction_facing">
                                                        <option value="">Select Direction</option>
                                                        <option value="East"
                                                            {{ old('direction_facing', $property->direction_facing) == 'East' ? 'selected' : '' }}>
                                                            East</option>
                                                        <option value="West"
                                                            {{ old('direction_facing', $property->direction_facing) == 'West' ? 'selected' : '' }}>
                                                            West</option>
                                                        <option value="North"
                                                            {{ old('direction_facing', $property->direction_facing) == 'North' ? 'selected' : '' }}>
                                                            North</option>
                                                        <option value="South"
                                                            {{ old('direction_facing', $property->direction_facing) == 'South' ? 'selected' : '' }}>
                                                            South</option>
                                                        <option value="North-East"
                                                            {{ old('direction_facing', $property->direction_facing) == 'North-East' ? 'selected' : '' }}>
                                                            North-East</option>
                                                        <option value="North-West"
                                                            {{ old('direction_facing', $property->direction_facing) == 'North-West' ? 'selected' : '' }}>
                                                            North-West</option>
                                                        <option value="South-East"
                                                            {{ old('direction_facing', $property->direction_facing) == 'South-East' ? 'selected' : '' }}>
                                                            South-East</option>
                                                        <option value="South-West"
                                                            {{ old('direction_facing', $property->direction_facing) == 'South-West' ? 'selected' : '' }}>
                                                            South-West</option>
                                                    </select>
                                                    <div id="direction_facing_error" class="text-danger dynamic-error">
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="form-step d-none" id="step-5">
                                                <div class="col-md-6" id="brokerFeeContainer"
                                                    style="display: none; margin-left: 10px;">
                                                    <div class="form-group">
                                                        <label class="mb-2 d-block">Brokerage Type <span
                                                                class="text-danger">*</span></label>
                                                        <div class="row">
                                                            <div class="col-md-4">
                                                                <div class="form-check mb-0">
                                                                    <input class="form-check-input" type="radio"
                                                                        name="brokerage_type" id="no_brokerage"
                                                                        value="no_brokerage"
                                                                        {{ old('brokerage_type', $property->brokerage_type) == 'no_brokerage' ? 'checked' : '' }}>
                                                                    <label class="form-check-label"
                                                                        for="no_brokerage">No Brokerage</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-4">
                                                                <div class="form-check mb-0">
                                                                    <input class="form-check-input" type="radio"
                                                                        name="brokerage_type" id="fixed_brokerage"
                                                                        value="fixed"
                                                                        {{ old('brokerage_type', $property->brokerage_type) == 'fixed' ? 'checked' : '' }}>
                                                                    <label class="form-check-label"
                                                                        for="fixed_brokerage">Fixed</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-4">
                                                                <div class="form-check mb-0">
                                                                    <input class="form-check-input" type="radio"
                                                                        name="brokerage_type" id="percentage_brokerage"
                                                                        value="percentage"
                                                                        {{ old('brokerage_type', $property->brokerage_type) == 'percentage' ? 'checked' : '' }}>
                                                                    <label class="form-check-label"
                                                                        for="percentage_brokerage">Percentage</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="brokerage_type_error" class="text-danger dynamic-error">
                                                    </div>
                                                    @error('brokerage_type')
                                                        <span class="text-danger">{{ $message }}</span>
                                                    @enderror
                                                    <div class="form-group mt-2" id="brokerFeeField"
                                                        style="display: none;">
                                                        <label for="brokerage_fee" id="brokerage_fee_label">Broker
                                                            Fee</label>
                                                        <input type="text" class="form-control"
                                                            name="brokerage_fee" id="brokerage_fee"
                                                            value="{{ old('brokerage_fee', $property->brokerage_fee) }}"
                                                            placeholder="Enter amount">
                                                        <div id="brokerage_fee_error" class="text-danger dynamic-error">
                                                        </div>
                                                        @error('brokerage_fee')
                                                            <span class="text-danger">{{ $message }}</span>
                                                        @enderror
                                                    </div>
                                                </div>
                                                <div id="seo-section">
                                                    <div class="card mx-2 my-4 ">
                                                        <div class="card-header">
                                                            SEO Section
                                                        </div>
                                                        <div class="card-body">
                                                            <div class="form-group position-relative">
                                                                <label for="seo_title" class="form-label">SEO
                                                                    Title</label>
                                                                <div class="input-group">
                                                                    <input type="text" class="form-control mb-1"
                                                                        placeholder="SEO Title" name="seo_title"
                                                                        id="seo_title" maxlength="70"
                                                                        value="{{ old('seo_title', $property->seo_title ?? '') }}">
                                                                    <span class="input-group-text"
                                                                        id="seo_title_counter">70/70</span>
                                                                </div>
                                                            </div>
                                                            <div class="form-group position-relative">
                                                                <label for="seo_desc" class="form-label">SEO
                                                                    Description</label>
                                                                <div class="input-group">
                                                                    <input type="text" class="form-control mb-1"
                                                                        placeholder="SEO Description" name="seo_desc"
                                                                        id="seo_desc" maxlength="120"
                                                                        value="{{ old('seo_desc', $property->seo_desc ?? '') }}">
                                                                    <span class="input-group-text"
                                                                        id="seo_desc_counter">160/160</span>
                                                                </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="seo_img" class="form-label">SEO Image (Max
                                                                    2MB, JPEG/PNG only) - 1000x1000px</label>
                                                                <div class="mb-2">
                                                                    @if (!empty($property->seo_img))
                                                                        <div class="image-preview thumbnail-img"
                                                                            id="seo-img-old">
                                                                            <img src="{{ asset($property->seo_img) }}"
                                                                                alt="SEO Image"
                                                                                style="max-width: 200px; max-height: 120px; border:1px solid #ccc;" />
                                                                            <button type="button"
                                                                                class="remove-btn-thumbnail"
                                                                                onclick="deleteSeoImage()">×</button>
                                                                            <input type="hidden" name="delete_seo_img"
                                                                                id="delete-seo-img" value="">
                                                                        </div>
                                                                    @endif
                                                                    <div class="image-preview thumbnail-img"
                                                                        id="seo-img-preview-container"
                                                                        style="display: none;">
                                                                        <img id="seo_img_preview" src=""
                                                                            alt="SEO Image Preview"
                                                                            style="max-width: 200px; max-height: 120px; border:1px solid #ccc; border-radius: 5px;" />
                                                                    </div>
                                                                </div>
                                                                <input type="file" class="form-control"
                                                                    name="seo_img" id="seo_img"
                                                                    accept=".jpeg,.png,.jpg,.gif,.svg">
                                                                <div id="seo-image-upload-info" class="text-info mt-2"
                                                                    style="font-size: 12px;">
                                                                    <i class="fas fa-info-circle"></i>
                                                                    Please select image files (JPEG/PNG/JPG/GIF/SVG) only.
                                                                    Maximum file size: 2MB. Dimensions: 1000x1000px.
                                                                </div>
                                                                <div id="seo-file-size-warning"
                                                                    class="text-warning mt-2" style="display: none;">
                                                                    <i class="fas fa-exclamation-triangle"></i>
                                                                    <span id="seo-file-size-message"></span>
                                                                </div>
                                                                <div id="seo-image-success-message"
                                                                    class="text-success mt-2" style="display: none;">
                                                                    <i class="fas fa-check-circle"></i>
                                                                    SEO image added successfully!
                                                                </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="seo_index" class="form-label">SEO
                                                                    Index</label>
                                                                <select class="form-control" name="seo_index"
                                                                    id="seo_index">
                                                                    <option value="1"
                                                                        {{ old('seo_index', $property->seo_index) == 1 ? 'selected' : '' }}>
                                                                        Index</option>
                                                                    <option value="0"
                                                                        {{ old('seo_index', $property->seo_index) == 0 ? 'selected' : '' }}>
                                                                        No Index</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="row" style="padding-left: 20px;">
                                                    <input type="hidden" name="status" value="selling">
                                                    <div class="col-md-12">
                                                        @php
                                                            $oldRegionsRaw =
                                                                old('region') ?? json_encode($decodedRegion ?? []);
                                                            $oldRegions = json_decode($oldRegionsRaw, true) ?: [];
                                                            $oldRegionsValues = array_map(
                                                                fn($item) => $item['value'] ?? '',
                                                                $oldRegions,
                                                            );
                                                            $oldRegionsValues = array_filter($oldRegionsValues);
                                                        @endphp
                                                    </div>
                                                </div>
                                                <div id="video-section" class="p-3 my-3 rounded"
                                                    style="display:none;">
                                                    <div class="form-group">
                                                        <label for="video_url" class="form-label">Video URL</label>
                                                        <input type="url" class="form-control" id="video_url"
                                                            name="video_url"
                                                            value="{{ old('video_url', $videoLink->video_url ?? '') }}"
                                                            placeholder="https://youtu.be/xxxx">
                                                        <small class="form-text text-muted">
                                                            Use the YouTube video link to be able to watch the video
                                                            directly on the website.
                                                        </small>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="video_thumbnail" class="form-label">Video Thumbnail
                                                            (Max 2MB, JPEG/PNG only) - 1280x720px</label>
                                                        <div class="mb-2">
                                                            @if (!empty($videoLink->video_thumbnail))
                                                                <div class="image-preview thumbnail-img"
                                                                    id="video-thumbnail-old">
                                                                    <img src="{{ asset($videoLink->video_thumbnail) }}"
                                                                        alt="Preview image" class="img-thumbnail"
                                                                        width="120">
                                                                    <button type="button" class="remove-btn-thumbnail"
                                                                        onclick="deleteVideoThumbnail()">×</button>
                                                                    <input type="hidden" name="delete_video_thumbnail"
                                                                        id="delete-video-thumbnail" value="">
                                                                </div>
                                                            @endif
                                                            <div class="image-preview thumbnail-img"
                                                                id="video-thumbnail-preview-container"
                                                                style="display: none;">
                                                                <img id="video_thumbnail_preview" src=""
                                                                    alt="Preview image"
                                                                    style="max-width: 120px; max-height: 120px; border:1px solid #ccc; border-radius: 5px;" />
                                                            </div>
                                                        </div>
                                                        <input type="file" class="form-control mt-2"
                                                            id="video_thumbnail" name="video_thumbnail"
                                                            accept=".jpeg,.png,.jpg,.gif,.svg">
                                                        <div id="video-thumbnail-upload-info" class="text-info mt-2"
                                                            style="font-size: 12px;">
                                                            <i class="fas fa-info-circle"></i>
                                                            Please select image files (JPEG/PNG/JPG/GIF/SVG) only. Maximum
                                                            file size: 2MB. Dimensions: 1280x720px.
                                                        </div>
                                                        <div id="video-thumbnail-file-size-warning"
                                                            class="text-warning mt-2"
                                                            style="display: none; background-color: #fff3cd !important; border: 1px solid #ffeaa7 !important; color: #856404 !important; padding: 8px 12px !important; border-radius: 4px !important; z-index: 1000 !important; position: relative !important;">
                                                            <i class="fas fa-exclamation-triangle"></i>
                                                            <span id="video-thumbnail-file-size-message"></span>
                                                        </div>
                                                        <div id="video-thumbnail-success-message"
                                                            class="text-success mt-2" style="display: none;">
                                                            <i class="fas fa-check-circle"></i>
                                                            Video thumbnail added successfully!
                                                        </div>

                                                        <small class="form-text text-muted">
                                                            If you use the YouTube video link above, the thumbnail will be
                                                            automatically obtained.
                                                        </small>
                                                    </div>
                                                </div>

                                            </div>
                                            <div class="mt-3">
                                                <button type="button" class="btn btn-secondary" id="prevBtn"
                                                    style="display:none">Previous
                                                </button>
                                                <button type="button" class="btn btn-primary float-end"
                                                    id="nextBtn">Next
                                                </button>
                                                <button type="submit" id="submitBtn"
                                                    class="btn btn-success float-end" style="display:none">Update
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <style>
        .form-text.text-muted {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 4px;
            width: 100%;
            font-size: 0.875rem;
        }

        #full-preview {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #6c757d;
            font-family: 'Segoe UI', monospace;
            flex: 1;
            line-height: 1.4;
        }

        #full-preview:hover {
            color: #0d6efd;
            text-decoration: underline;
            cursor: pointer;
        }
    </style>
@endsection
@section('scripts')
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const nameInput = document.getElementById('name');
            if (nameInput) {
                nameInput.addEventListener('input', function() {
                    if (this.value.length > 0) {
                        this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
                    }
                });
            }
        });
        function toggleParkingSection(show) {
            const parkingTypeDiv = document.getElementById('parking_type_div');
            if (parkingTypeDiv) {
                parkingTypeDiv.style.display = show ? 'block' : 'none';
            }
            const slotsWrapper = document.getElementById('parking_slots_wrapper');
            if (slotsWrapper) {
                slotsWrapper.style.display = show ? 'block' : 'none';
            }
        }

        function toggleSlotInput(show) {}

        function toggleSecurityDepositInput(type) {
            const amountInput = document.getElementById('security_deposit_amount');
            const wordsDiv = document.getElementById('security_deposit_words_div');
            const showAmount = (type === 'Fixed');
            if (amountInput) {
                amountInput.style.display = showAmount ? 'block' : 'none';
                if (!showAmount) amountInput.value = '';
            }
            if (wordsDiv) {
                wordsDiv.style.display = showAmount ? 'block' : 'none';
                if (!showAmount) document.getElementById('security_deposit_words_input').value = '';
            }
        }

        function toggleMaintenance(show) {
            const amountInput = document.getElementById('maintenance_amount_input');
            const wordsDiv = document.getElementById('maintenance_words_div');
            if (amountInput) amountInput.style.display = show ? 'block' : 'none';
            if (wordsDiv) wordsDiv.style.display = show ? 'block' : 'none';
        }

        function toggleAvailabilityDate() {
            const status = document.getElementById('availability_status').value;
            const dateInput = document.getElementById('availability_date');
            if (dateInput) {
                dateInput.style.display = status === 'Available From' ? 'block' : 'none';
            }
        }

        function enforcePriceMax(input) {
            let raw = input.value.replace(/[^\d]/g, '');
            if (raw.length > 12) raw = raw.slice(0, 12);
            input.value = raw ? Number(raw).toLocaleString('en-IN') : '';
        }

        function enforceNumberMax(input) {
            if (input.value.length > 12) input.value = input.value.slice(0, 12);
        }

        function formatIndianPrice(input) {
            let raw = input.value.replace(/[^0-9]/g, '');
            if (raw.length > 12) raw = raw.slice(0, 12);
            input.value = raw ? Number(raw).toLocaleString('en-IN') : '';
        }

        function updateRentLeaseType() {
            const rentLeaseType = document.querySelector('input[name="rent_lease_type"]:checked')?.value;
            const priceLabel       = document.getElementById('price_label');
            const priceInput       = document.getElementById('price');
            const securitySec      = document.getElementById('security_deposit_section');
            const maintenanceSec   = document.getElementById('maintenance_section');
            const leaseFields      = document.getElementById('lease_specific_fields');
            const noticeSec        = document.getElementById('notice_period_section');

            if (rentLeaseType === 'rent') {
                if (priceLabel)     priceLabel.innerHTML = 'Rent Amount <span class="text-danger">*</span>';
                if (priceInput)     priceInput.dataset.max = '9900000'; // 99 lakh
                if (securitySec)    securitySec.style.display    = 'flex';
                if (maintenanceSec) maintenanceSec.style.display = 'flex';
                if (leaseFields)    leaseFields.style.display    = 'none';
                if (noticeSec)      noticeSec.style.display      = 'block';
            } else if (rentLeaseType === 'lease') {
                if (priceLabel)     priceLabel.innerHTML = 'Lease Amount <span class="text-danger">*</span>';
                if (priceInput)     priceInput.dataset.max = '990000000'; // 99 crore
                if (securitySec)    securitySec.style.display    = 'none';
                if (maintenanceSec) maintenanceSec.style.display = 'none';
                if (leaseFields)    leaseFields.style.display    = 'block';
                if (noticeSec)      noticeSec.style.display      = 'block';
            } else {
                if (priceLabel)     priceLabel.innerHTML = 'Price <span class="text-danger">*</span>';
                if (priceInput)     priceInput.dataset.max = '990000000'; // 99 crore (sell)
                if (securitySec)    securitySec.style.display    = 'none';
                if (maintenanceSec) maintenanceSec.style.display = 'none';
                if (leaseFields)    leaseFields.style.display    = 'none';
                if (noticeSec)      noticeSec.style.display      = 'none';
            }
        }

        function addSpecification() {
            const container = document.getElementById('keySpecificationsContainer');
            if (container) {
                const newRow = document.createElement('div');
                newRow.className = 'row key-specification-row mb-2';
                newRow.innerHTML = `
                <div class="col-md-10">
                    <input type="text" class="form-control" name="key_specifications[]" placeholder="Eg: 1st Floor, Parking, Lift">
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-outline-dark" onclick="removeRow(this)"><i class="fa fa-trash"></i></button>
                </div>
            `;
                container.appendChild(newRow);
            }
        }

        function removeRow(button) {
            const row = button.closest('.row');
            if (row) row.remove();
        }

        function convertPriceToText(value, targetId) {
            const target = document.getElementById(targetId);
            if (!target) return;

            const num = parseInt(value.replace(/,/g, ''));
            if (isNaN(num) || num === 0) {
                target.value = '';
                return;
            }

            const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
                'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
            ];
            const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

            function convertToWords(n) {
                if (n < 20) return ones[n];
                if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
                if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertToWords(n % 100) :
                '');
                if (n < 100000) return convertToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' +
                    convertToWords(n % 1000) : '');
                if (n < 10000000) return convertToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' +
                    convertToWords(n % 100000) : '');
                return convertToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convertToWords(n %
                    10000000) : '');
            }

            target.value = convertToWords(num) + ' Rupees Only';
        }

        document.addEventListener('DOMContentLoaded', function() {
            const parkingYes = document.getElementById('parking_yes');
            if (parkingYes && parkingYes.checked) {
                toggleParkingSection(true);
                const parkingType = document.querySelector('input[name="parking_type"]:checked');
                if (parkingType) toggleSlotInput(true);
            }

            const secType = document.querySelector('input[name="security_deposit_type"]:checked');
            if (secType) toggleSecurityDepositInput(secType.value);

            const maintYes = document.getElementById('maint_yes');
            if (maintYes && maintYes.checked) toggleMaintenance(true);
            updateRentLeaseType();
            toggleAvailabilityDate();
            const priceInput = document.getElementById('price');
            if (priceInput && priceInput.value) {
                convertPriceToText(priceInput.value, 'price_in_words_input');
            }

            const securityDepositInput = document.getElementById('security_deposit_amount');
            if (securityDepositInput && securityDepositInput.value) {
                const secRaw = securityDepositInput.value.replace(/[^\d]/g, '');
                if (secRaw) securityDepositInput.value = Number(secRaw).toLocaleString('en-IN');
                convertPriceToText(secRaw, 'security_deposit_words_input');
            }

            const maintenanceInput = document.getElementById('maintenance_amount_input');
            if (maintenanceInput && maintenanceInput.value) {
                const maintRaw = maintenanceInput.value.replace(/[^\d]/g, '');
                if (maintRaw) maintenanceInput.value = Number(maintRaw).toLocaleString('en-IN');
                convertPriceToText(maintRaw, 'maintenance_charge_words_input');
            }
        });
        $(document).ready(function() {
            const urlParams = new URLSearchParams(window.location.search);
            const isViewMode = urlParams.get('mode') === 'view';
            const isPending = '{{ $property->moderation_status ?? '' }}' === 'pending';

            // Always lock the 4 top rows + highlight active subtype button (delayed so init JS runs first)
            setTimeout(function() {
                // Use pointer-events:none instead of disabled — disabled fields are not submitted with the form
                $('input[name="property_for"], input[name="owner_type"], input[name="property_main_type"]')
                    .closest('label, .form-check, div').css('pointer-events', 'none');
                $('input[name="property_for"], input[name="owner_type"], input[name="property_main_type"]')
                    .parent().css('opacity', '0.65');
                $('#property-type-wrapper button').prop('disabled', true);

                // Highlight the saved property type button
                const propertySubtype = $('#property_subtype').val();
                if (propertySubtype) {
                    $('#property-type-wrapper button').removeClass('active').attr('style', '');
                    const targetBtn = $(`#property-type-wrapper button[data-type="${propertySubtype}"]`);
                    if (targetBtn.length > 0) {
                        targetBtn.removeClass('d-none'); // ensure active button is visible regardless of JS visibility logic
                        targetBtn.addClass('active').attr('style',
                            'background-color: #163d75 !important; color: #fff !important; border-color: #163d75 !important; opacity: 1 !important;'
                        );
                    }
                }
            }, 600);

            if (isViewMode || isPending) {
                window.isPropertyViewMode = true;

                function disableAllFields() {
                    $('#propertyForm').addClass('view-mode-form');
                    $('#propertyForm input').not('#nextBtn, #prevBtn').prop('disabled', true).prop('readonly',
                    true);
                    $('#propertyForm select').prop('disabled', true);
                    $('#propertyForm textarea').prop('disabled', true).prop('readonly', true);
                    $('#propertyForm input[type="radio"]').prop('disabled', true);
                    $('#propertyForm input[type="checkbox"]').prop('disabled', true);
                    $('#submitBtn').hide();
                    if (typeof updateMainTypeVisibility === 'function') {
                        updateMainTypeVisibility();
                    }
                    if (typeof toggleUDSField === 'function') {
                        toggleUDSField();
                    }
                    const categoryName = '{{ $currentCategoryName ?? '' }}';
                    const commercialCategories = ['land', 'shop', 'building', 'godown',
                        'warehouse', 'office space'
                    ];
                    const residentialCategories = ['apartments', 'apartment', 'villas', 'villa',
                    'individual house', 'plots', 'plot'];

                    let correctMainType = 'residential';
                    if (commercialCategories.includes(categoryName)) {
                        correctMainType = 'commercial';
                    }

                    const currentMainType = $('input[name="property_main_type"]:checked').val();
                    if (currentMainType !== correctMainType) {
                        console.log('Fixing property_main_type from', currentMainType, 'to', correctMainType);
                        $(`input[name="property_main_type"][value="${correctMainType}"]`).prop('checked', true);
                        $('input[name="property_main_type"]').next('.form-check-label').css({
                            'background-color': '',
                            'color': '',
                            'border-color': '',
                            'opacity': '0.6'
                        });
                        $(`input[name="property_main_type"][value="${correctMainType}"]`).next('.form-check-label')
                            .css({
                                'background-color': '#163d75',
                                'color': '#fff',
                                'border-color': '#163d75',
                                'opacity': '1'
                            });
                        if (typeof updateMainTypeVisibility === 'function') {
                            updateMainTypeVisibility();
                        }
                        if (typeof toggleUDSField === 'function') {
                            toggleUDSField();
                        }
                    }
                    let propertySubtype = $('#property_subtype').val();
                    if (!propertySubtype || propertySubtype.trim() === '') {
                        console.log('Property subtype empty, using category name:', categoryName);
                        const categoryMap = {
                            'apartments': 'apartment',
                            'apartment': 'apartment',
                            'villas': 'villa',
                            'villa': 'villa',
                            'individual house': 'individual_house',
                            'plots': 'plot',
                            'plot': 'plot',
                            'land': 'land',
                            'shop': 'shop',
                            'building': 'building',
                            'godown': 'godown',
                            'warehouse': 'warehouse',
                            'office space': 'office_space'
                        };

                        propertySubtype = categoryMap[categoryName] || '';
                        if (propertySubtype) {
                            $('#property_subtype').val(propertySubtype);
                            console.log('Set property_subtype to:', propertySubtype);
                        }
                    }

                    if (propertySubtype) {
                        $('#property-type-wrapper button').removeClass('active');
                        let targetBtn = $(`#property-type-wrapper button[data-type="${propertySubtype}"]`);
                        if (targetBtn.length === 0) {
                            const subtypeLower = propertySubtype.toLowerCase();
                            $('#property-type-wrapper button').each(function() {
                                const dataType = $(this).attr('data-type');
                                if (dataType && dataType.toLowerCase() === subtypeLower) {
                                    targetBtn = $(this);
                                    return false; 
                                }
                            });
                        }

                        if (targetBtn.length > 0) {
                            targetBtn.addClass('active');
                            targetBtn.attr('style',
                                'background-color: #163d75 !important; color: #fff !important; border-color: #163d75 !important; opacity: 1 !important;'
                                );
                            console.log('✓ Property Type highlighted:', targetBtn.text());
                        } else {
                            console.warn('✗ No button found for property type:', propertySubtype);
                        }
                    }

                    $('input[type="radio"]:checked').each(function() {
                        const label = $(this).next('.form-check-label');
                        label.css({
                            'background-color': '#163d75',
                            'color': '#fff',
                            'border-color': '#163d75',
                            'opacity': '1'
                        });
                    });

                    const checkedPropertyFor = $('input[name="property_for"]:checked');
                    if (checkedPropertyFor.length) {
                        checkedPropertyFor.next('.form-check-label').css({
                            'background-color': '#163d75',
                            'color': '#fff',
                            'border-color': '#163d75',
                            'opacity': '1'
                        });
                    }

                    $('input[type="checkbox"]:checked').each(function() {
                        const label = $(this).next('.form-check-label');
                        label.css({
                            'background-color': '#163d75',
                            'color': '#fff',
                            'border-color': '#163d75',
                            'opacity': '1'
                        });
                    });

                    const parkingAvailability = $('input[name="parking_availability"]:checked').val();
                    if (parkingAvailability === 'Yes') {
                        const parkingTypeFromDb = '{{ $property->parking_type ?? '' }}';
                        let parkingTypeChecked = $('input[name="parking_type"]:checked');

                        if (parkingTypeChecked.length === 0 && parkingTypeFromDb) {
                            const parkingTypes = parkingTypeFromDb.split(',').map(t => t.trim().toLowerCase());
                            console.log('Parking types from DB:', parkingTypes);
                            const highlightedTypes = [];
                            $('input[name="parking_type"]').each(function() {
                                const val = $(this).val();
                                if (val && parkingTypes.includes(val.toLowerCase())) {
                                    $(this).next('.form-check-label').css({
                                        'background-color': '#163d75',
                                        'color': '#fff',
                                        'border-color': '#163d75',
                                        'opacity': '1'
                                    });
                                    highlightedTypes.push(val);
                                }
                            });

                            if (highlightedTypes.length > 0) {
                                console.log('✓ Parking Types highlighted:', highlightedTypes.join(', '));
                            } else {
                                console.warn('✗ Parking Type not selected but Parking Availability is Yes');
                            }
                        } else if (parkingTypeChecked.length > 0) {
                            parkingTypeChecked.next('.form-check-label').css({
                                'background-color': '#163d75',
                                'color': '#fff',
                                'border-color': '#163d75',
                                'opacity': '1'
                            });
                            console.log('✓ Parking Type highlighted:', parkingTypeChecked.val());
                        }
                    }

                    $('button[onclick*="addFacility"], button[onclick*="removeRow"], button[onclick*="addSpecification"]')
                        .hide();
                    $('.btn-outline-dark').hide();
                    $('#propertyForm input[type="file"]').prop('disabled', true);
                }

                disableAllFields();
                setTimeout(function() {
                    disableAllFields();
                }, 500);

                setTimeout(function() {
                    const propertySubtype = $('#property_subtype').val();

                    if (propertySubtype) {
                        let targetBtn = $(`#property-type-wrapper button[data-type="${propertySubtype}"]`);
                        if (targetBtn.length === 0) {
                            const subtypeLower = propertySubtype.toLowerCase();
                            $('#property-type-wrapper button').each(function() {
                                const dataType = $(this).attr('data-type');
                                if (dataType && dataType.toLowerCase() === subtypeLower && !$(this)
                                    .hasClass('d-none')) {
                                    targetBtn = $(this);
                                    return false;
                                }
                            });
                        }

                        if (targetBtn.length > 0 && !targetBtn.hasClass('d-none')) {
                            $('#property-type-wrapper button').removeClass('active');
                            targetBtn.addClass('active');
                            targetBtn.attr('style',
                                'background-color: #163d75 !important; color: #fff !important; border-color: #163d75 !important; opacity: 1 !important;'
                                );
                        }
                    }
                }, 1000);

                $('h2:contains("Edit Property"), h2:contains("View Property")').first().text('View Property');

                if ($('#view-mode-banner').length === 0) {
                    $('#propertyForm').prepend(`
                <div id="view-mode-banner" class="alert alert-info mb-3" role="alert">
                    <i class="fa fa-info-circle"></i> <strong>View Only Mode:</strong> This property is pending approval and cannot be edited.
                </div>
            `);
                }

                setTimeout(disableAllFields, 500);
                setTimeout(disableAllFields, 1000);
                setTimeout(disableAllFields, 2000);
                setTimeout(function() {
    const secType = document.querySelector('input[name="security_deposit_type"]:checked');
    if (secType) {
        const amountInput = document.getElementById('security_deposit_amount');
        const wordsDiv = document.getElementById('security_deposit_words_div');
        const showAmount = secType.value === 'Fixed';
        if (amountInput) amountInput.style.display = showAmount ? 'block' : 'none';
        if (wordsDiv) wordsDiv.style.display = showAmount ? 'block' : 'none';
    }

    const maintYes = document.getElementById('maint_yes');
    if (maintYes && maintYes.checked) {
        document.getElementById('maintenance_amount_input').style.display = 'block';
        document.getElementById('maintenance_words_div').style.display = 'block';
    }

    const propertyFor = '{{ $property->property_for }}';
    if (propertyFor === 'rent') {
        document.getElementById('security_deposit_section').style.display = 'flex';
        document.getElementById('maintenance_section').style.display = 'flex';
        document.getElementById('notice_period_section').style.display = 'block';
        document.getElementById('rent_lease_toggle_section').style.display = 'block';
        document.getElementById('lease_specific_fields').style.display = 'none';
    } else if (propertyFor === 'lease') {
        document.getElementById('security_deposit_section').style.display = 'none';
        document.getElementById('maintenance_section').style.display = 'none';
        document.getElementById('notice_period_section').style.display = 'block';
        document.getElementById('rent_lease_toggle_section').style.display = 'block';
        document.getElementById('lease_specific_fields').style.display = 'block';
    }
}, 2500);
                $('#propertyForm').on('submit', function(e) {
                    e.preventDefault();
                    alert('This property is pending approval and cannot be edited.');
                    return false;
                });

                $('#propertyForm').on('input change', 'input, select, textarea', function(e) {
                    if (window.isPropertyViewMode) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                });

                console.log('Edit Property: View mode enabled - form is read-only');
            }

            function toggleBrokerFeeField() {
                const ownerType = $('input[name="owner_type"]:checked').val();
                const selectedType = $('input[name="brokerage_type"]:checked').val();
                if (ownerType === 'Consultant') {
                    $('#brokerFeeContainer').show();
                    $('input[name="brokerage_type"]').prop('required', true);
                    if (selectedType === 'fixed' || selectedType === 'percentage') {
                        $('#brokerFeeField').show();
                        $('#brokerage_fee').prop('required', true);
                        if (selectedType === 'percentage') {
                            $('#brokerage_fee_label').text('Brokerage Fee (%)');
                            $('#brokerage_fee').attr('placeholder', 'Enter percentage (e.g., 5)');
                        } else {
                            $('#brokerage_fee_label').text('Brokerage Fee');
                            $('#brokerage_fee').attr('placeholder', 'Enter amount');
                        }
                    } else {
                        $('#brokerFeeField').hide();
                        $('#brokerage_fee').prop('required', false);
                        $('#brokerage_fee_error').text('');
                    }
                } else {
                    $('#brokerFeeContainer').hide();
                    $('#brokerFeeField').hide();
                    $('input[name="brokerage_type"]').prop('required', false);
                    $('#brokerage_fee').prop('required', false);
                    $('#brokerage_fee_error').text('');
                }
            }
            toggleBrokerFeeField();
            const initialBrokerageType = $('input[name="brokerage_type"]:checked').val();
            const initialBrokerageFee = $('#brokerage_fee').val();
            if (initialBrokerageType === 'percentage' && initialBrokerageFee) {
                const cleanValue = parseFloat(initialBrokerageFee).toString();
                $('#brokerage_fee').val(cleanValue);
                $('#brokerage_fee_label').text('Brokerage Fee (%)');
            } else if (initialBrokerageType === 'fixed' && initialBrokerageFee) {
                const cleanValue = parseFloat(initialBrokerageFee).toString();
                const formattedValue = Number(cleanValue).toLocaleString('en-IN');
                $('#brokerage_fee').val(formattedValue);
                $('#brokerage_fee_label').text('Brokerage Fee');
            }
            $('input[name="owner_type"]').change(function() {
                toggleBrokerFeeField();
            });
            $('input[name="brokerage_type"]').change(function() {
                $('#brokerage_fee').val('');
                $('#brokerage_fee_error').text('');
                toggleBrokerFeeField();
                $('#brokerage_type_error').text('');
            });

            $('#brokerage_fee').on('input', function() {
                $('#brokerage_fee_error').text('');
                const selectedType = $('input[name="brokerage_type"]:checked').val();

                if (selectedType === 'percentage') {
                    let value = this.value.replace(/[^\d.]/g, '');
                    const parts = value.split('.');
                    if (parts.length > 2) {
                        value = parts[0] + '.' + parts.slice(1).join('');
                    }
                    if (value.includes('.')) {
                        value = parseFloat(value).toString();
                    }

                    if (value) {
                        this.value = value + '%';
                    } else {
                        this.value = '';
                    }
                } else {
                    let value = this.value.replace(/[^\d,]/g, '');
                    if (value.includes('.')) {
                        value = parseFloat(value).toString();
                    }

                    this.value = value;
                }
            });

            $('#brokerage_fee').on('focus', function() {
                const selectedType = $('input[name="brokerage_type"]:checked').val();
                if (selectedType === 'percentage' && this.value.includes('%')) {
                    const cursorPosition = this.value.length - 1; // Position before %
                    this.setSelectionRange(cursorPosition, cursorPosition);
                }
            });

            $('#brokerage_fee').on('input', function() {
                const selectedType = $('input[name="brokerage_type"]:checked').val();
                let value = this.value.replace(/[^\d]/g, ''); // Remove non-digits

                if (selectedType === 'percentage') {
                    if (value.length > 1) {
                        value = value.slice(0, 1);
                    }
                    this.value = value;
                } else if (selectedType === 'fixed') {
                    if (value.length > 7) {
                        value = value.slice(0, 7);
                    }
                    if (value) {
                        const formattedValue = Number(value).toLocaleString('en-IN');
                        this.value = formattedValue;
                    } else {
                        this.value = '';
                    }
                }

                $('#brokerage_fee_error').text('');
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            const jsonString = '@json($existingFieldValues)';
            const existingFieldValues = JSON.parse(jsonString);

            function toggleBedBathFields() {
                const subtype = document.getElementById('property_subtype')?.value || '';
                const bedroomsSection = document.getElementById('bedrooms-section');
                const bathroomsSection = document.getElementById('bathrooms-section');
                const bedroomsInput = document.getElementById('bedrooms');
                const bathroomsInput = document.getElementById('bathrooms');

                const showBoth = ['apartment', 'villa', 'individual_house'].includes(subtype);
                const showBathOnly = ['shop', 'building', 'godown', 'warehouse', 'office_space'].includes(subtype);

                if (showBoth) {
                    if (bedroomsSection) bedroomsSection.style.display = '';
                    if (bathroomsSection) bathroomsSection.style.display = '';
                    if (bedroomsInput) bedroomsInput.setAttribute('required', 'required');
                    if (bathroomsInput) bathroomsInput.setAttribute('required', 'required');
                    updateFieldLabels(true, true);
                } else if (showBathOnly) {
                    if (bedroomsSection) bedroomsSection.style.display = 'none';
                    if (bathroomsSection) bathroomsSection.style.display = '';
                    if (bedroomsInput) bedroomsInput.removeAttribute('required');
                    if (bathroomsInput) bathroomsInput.removeAttribute('required');
                    updateFieldLabels(false, false);
                } else {
                    if (bedroomsSection) bedroomsSection.style.display = 'none';
                    if (bathroomsSection) bathroomsSection.style.display = 'none';
                    if (bedroomsInput) bedroomsInput.removeAttribute('required');
                    if (bathroomsInput) bathroomsInput.removeAttribute('required');
                    updateFieldLabels(false, false);
                }
            }

            function updateFieldLabels(showBedroomAsterisk, showBathroomAsterisk) {
                const bedroomsLabel = document.querySelector('label[for="bedrooms"]');
                const bathroomsLabel = document.querySelector('label[for="bathrooms"]');

                if (bedroomsLabel) {
                    if (showBedroomAsterisk) {
                        if (!bedroomsLabel.innerHTML.includes('<span class="text-danger">*</span>')) {
                            bedroomsLabel.innerHTML = bedroomsLabel.innerHTML.replace('Bedrooms',
                                'Bedrooms <span class="text-danger">*</span>');
                        }
                    } else {
                        bedroomsLabel.innerHTML = bedroomsLabel.innerHTML.replace(
                            ' <span class="text-danger">*</span>', '');
                    }
                }

                if (bathroomsLabel) {
                    if (showBathroomAsterisk) {
                        if (!bathroomsLabel.innerHTML.includes('<span class="text-danger">*</span>')) {
                            bathroomsLabel.innerHTML = bathroomsLabel.innerHTML.replace('Bathrooms',
                                'Bathrooms <span class="text-danger">*</span>');
                        }
                    } else {
                        bathroomsLabel.innerHTML = bathroomsLabel.innerHTML.replace(
                            ' <span class="text-danger">*</span>', '');
                    }
                }
            }

            document.querySelectorAll('input[name="category_id"]').forEach(function(radio) {
                radio.addEventListener('change', function() {
                    setTimeout(toggleBedBathFields, 200); // Wait for custom fields to render
                });
            });

            function attachCommercialTypeListeners() {
                document.querySelectorAll('input[name="custom_fields[select][value]"]').forEach(function(radio) {
                    radio.addEventListener('change', toggleBedBathFields);
                });
            }

            document.addEventListener('customFieldsRendered', function() {
                attachCommercialTypeListeners();
                toggleBedBathFields();
            });

            attachCommercialTypeListeners();
            toggleBedBathFields();
        });

        document.addEventListener('DOMContentLoaded', function() {
            const jsonString = '@json($existingFieldValues)';
            const existingFieldValues = JSON.parse(jsonString);

            function updateDirectionFacingRequired() {
                const category = document.querySelector('input[name="category_id"]:checked')?.value;
                const commercialType = existingFieldValues?.Select?.value || null;
                console.log("commercialType", commercialType)
                const directionSelect = document.getElementById('direction_facing');
                const asterisk = document.getElementById('direction-facing-asterisk');
                if (!directionSelect || !asterisk) return;

                if (category === '3' || (category === '6' && commercialType && commercialType.toLowerCase() ===
                        'land')) {
                    directionSelect.setAttribute('required', 'required');
                    asterisk.style.display = '';
                } else {
                    directionSelect.removeAttribute('required');
                    asterisk.style.display = 'none';
                    const errorDiv = document.getElementById('direction_facing_error');
                    if (errorDiv) errorDiv.textContent = '';
                }
            }

            document.querySelectorAll('input[name="category_id"]').forEach(function(radio) {
                radio.addEventListener('change', function() {
                    setTimeout(updateDirectionFacingRequired, 200);
                });
            });

            function attachCommercialTypeListeners() {
                document.querySelectorAll('input[name="custom_fields[select][value]"]').forEach(function(radio) {
                    radio.addEventListener('change', updateDirectionFacingRequired);
                });
            }
            attachCommercialTypeListeners();
            updateDirectionFacingRequired();

            const directionSelect = document.getElementById('direction_facing');
            if (directionSelect) {
                directionSelect.addEventListener('change', function() {
                    const errorDiv = document.getElementById('direction_facing_error');
                    if (errorDiv) errorDiv.textContent = '';
                });
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            function updateCharCounter(input) {
                const counter = input.parentElement.querySelector('.char-counter');
                if (counter) {
                    const max = input.getAttribute('maxlength') || 50;
                    const len = input.value.length;
                    counter.textContent = (max - len) + '/' + max;
                }
            }

            document.querySelectorAll('.facility-value-input').forEach(function(input) {
                updateCharCounter(input);
                input.addEventListener('input', function() {
                    updateCharCounter(this);
                });
            });

            const facilitiesContainer = document.getElementById('facilitiesContainer');
            if (facilitiesContainer) {
                facilitiesContainer.addEventListener('input', function(e) {
                    if (e.target && e.target.classList.contains('facility-value-input')) {
                        updateCharCounter(e.target);
                    }
                });
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            const nameInput = document.getElementById('name');
            const permalinkInput = document.getElementById('permalink');
            const previewSpan = document.getElementById('permalink-preview');
            let permalinkEdited = false;

            if (!nameInput || !permalinkInput) return;

            permalinkInput.addEventListener('input', function() {
                permalinkEdited = true;
                if (previewSpan) previewSpan.textContent = this.value;
            });

            nameInput.addEventListener('input', function() {
                if (!permalinkEdited || !permalinkInput.value) {
                    let slug = nameInput.value
                        .toLowerCase()
                        .replace(/\s+/g, '-') // spaces to dashes
                        .replace(/[^a-z0-9\-]/g, '') // remove non-alphanumeric except dash
                        .replace(/\-+/g, '-'); // collapse multiple dashes
                    permalinkInput.value = slug;
                    if (previewSpan) previewSpan.textContent = slug;
                }
            });

            if (previewSpan) previewSpan.textContent = permalinkInput.value;
        });

        document.addEventListener('DOMContentLoaded', function() {
            const permalinkInput = document.getElementById('permalink');
            const permalinkPreview = document.getElementById('permalink-preview'); // Ensure this element exists
            let debounceTimer; // For debouncing the AJAX calls
            function checkPermalinkUniqueness(slugToCheck) {
                if (!permalinkInput) { // Ensure permalinkInput exists
                    console.warn("Permalink input element not found. Skipping uniqueness check.");
                    return;
                }

                if (!slugToCheck.trim()) {
                    clearPermalinkFeedback();
                    return;
                }

                const propertyId =
                {{ isset($property) ? $property->id : 'null' }}; // Pass property ID for edit forms

                fetch('{{ route('check.slug.unique') }}', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': '{{ csrf_token() }}' // Laravel CSRF token
                        },
                        body: JSON.stringify({
                            permalink: slugToCheck,
                            property_id: propertyId
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        const permalinkGroup = permalinkInput.closest('.form-group');
                        let feedbackDiv = permalinkGroup.querySelector('#permalink-feedback');

                        if (!feedbackDiv) {
                            feedbackDiv = document.createElement('div');
                            feedbackDiv.id = 'permalink-feedback';
                            permalinkGroup.appendChild(feedbackDiv);
                        }

                        if (data.unique) {
                            feedbackDiv.className = 'text-success mt-1';
                            feedbackDiv.textContent = 'Permalink is unique and available!';
                            permalinkInput.classList.remove('is-invalid');
                            permalinkInput.classList.add('is-valid');
                        } else {
                            feedbackDiv.className = 'text-danger mt-1';
                            feedbackDiv.innerHTML =
                                `Permalink is not unique. Suggested: <strong>${data.suggested_slug}</strong>`;
                            permalinkInput.classList.remove('is-valid');
                            permalinkInput.classList.add('is-invalid');
                        }
                    })
                    .catch(error => {
                        console.error('Error checking permalink uniqueness:', error);
                        const permalinkGroup = permalinkInput.closest('.form-group');
                        let feedbackDiv = permalinkGroup.querySelector('#permalink-feedback');
                        if (!feedbackDiv) {
                            feedbackDiv = document.createElement('div');
                            feedbackDiv.id = 'permalink-feedback';
                            permalinkGroup.appendChild(feedbackDiv);
                        }
                        feedbackDiv.className = 'text-danger mt-1';
                        feedbackDiv.textContent = 'Error checking permalink. Please try again.';
                        permalinkInput.classList.remove('is-valid');
                        permalinkInput.classList.add('is-invalid');
                    });
            }

            function clearPermalinkFeedback() {
                const permalinkGroup = permalinkInput.closest('.form-group');
                const feedbackDiv = permalinkGroup.querySelector('#permalink-feedback');
                if (feedbackDiv) {
                    feedbackDiv.textContent = '';
                    feedbackDiv.className = '';
                }
                permalinkInput.classList.remove('is-valid', 'is-invalid');
            }

            if (permalinkInput) {
                permalinkInput.addEventListener('input', function() {
                    const currentSlug = this.value;
                    if (permalinkPreview) {
                        permalinkPreview.textContent = currentSlug;
                    }

                    clearTimeout(debounceTimer); // Clear previous timer
                    debounceTimer = setTimeout(() => {
                        checkPermalinkUniqueness(currentSlug);
                    }, 500); // Debounce for 500ms
                });
            }

            const nameInputForCheck = document.getElementById('name'); // Get name input again to be self-contained
            if (nameInputForCheck) {
                nameInputForCheck.addEventListener('input', function() {
                    const currentSlug = permalinkInput.value;
                    if (currentSlug.trim()) {
                        clearTimeout(debounceTimer); // Clear any pending debounced checks
                        checkPermalinkUniqueness(currentSlug);
                    } else {
                        clearPermalinkFeedback(); // Clear feedback if slug becomes empty
                    }
                });
            }

            if (permalinkInput && permalinkInput.value.trim()) {
                if (permalinkPreview) {
                    permalinkPreview.textContent = permalinkInput.value;
                }
                checkPermalinkUniqueness(permalinkInput.value);
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            function toggleSeoSection() {
                const selected = document.querySelector('input[name="owner_type"]:checked');
                const seoSection = document.getElementById('seo-section');
                if (seoSection) {
                    if (selected && (selected.value === 'Owner' || selected.value === 'Builder')) {
                        seoSection.style.display = '';
                    } else {
                        seoSection.style.display = 'none';
                    }
                }
            }
            toggleSeoSection();
            document.querySelectorAll('input[name="owner_type"]').forEach(function(radio) {
                radio.addEventListener('change', toggleSeoSection);
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            function togglePermalinkSection() {
                const selected = document.querySelector('input[name="owner_type"]:checked');
                const permalinkSection = document.getElementById('permalink-section');
                const permalinkInput = document.getElementById('permalink');
                const permalinkNote = document.getElementById('permalink-note');

                if (permalinkSection) {
                    if (selected && (selected.value === 'Owner' || selected.value === 'Builder')) {
                        permalinkSection.style.display = '';
                        permalinkNote.style.display = 'none';
                        if (permalinkInput) {
                            permalinkInput.setAttribute('required', 'required');
                        }
                    } else if (selected && selected.value === 'Consultant') {
                        permalinkSection.style.display = 'none';
                        permalinkNote.style.display = 'none';
                        if (permalinkInput) {
                            permalinkInput.removeAttribute('required');
                        }
                    } else {
                        permalinkSection.style.display = 'none';
                        permalinkNote.style.display = 'none';
                        if (permalinkInput) {
                            permalinkInput.removeAttribute('required');
                        }
                    }
                }
            }

            function generateSlug(name) {
                return name.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim('-');
            }

            const nameInput = document.getElementById('name');
            const permalinkInput = document.getElementById('permalink');
            let permalinkEdited = false;

            if (nameInput && permalinkInput) {
                permalinkInput.addEventListener('input', function() {
                    permalinkEdited = true;
                });

                nameInput.addEventListener('input', function() {
                    if (!permalinkEdited || !permalinkInput.value) {
                        const slug = generateSlug(this.value);
                        permalinkInput.value = slug;
                        const previewSpan = document.getElementById('permalink-preview');
                        if (previewSpan) previewSpan.textContent = slug;
                    }
                });
            }

            if (nameInput && permalinkInput && nameInput.value && !permalinkInput.value) {
                const slug = generateSlug(nameInput.value);
                permalinkInput.value = slug;
                const previewSpan = document.getElementById('permalink-preview');
                if (previewSpan) previewSpan.textContent = slug;
            }

            togglePermalinkSection();
            document.querySelectorAll('input[name="owner_type"]').forEach(function(radio) {
                radio.addEventListener('change', togglePermalinkSection);
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            function updateCounter(input, counterId, max) {
                const counter = document.getElementById(counterId);
                if (counter) {
                    const len = input.value.length;
                    counter.textContent = (max - len) + '/' + max;
                }
            }

            const seoTitle = document.getElementById('seo_title');
            const seoDesc = document.getElementById('seo_desc');

            seoTitle && seoTitle.addEventListener('input', function() {
                updateCounter(this, 'seo_title_counter', 70);
            });
            seoDesc && seoDesc.addEventListener('input', function() {
                updateCounter(this, 'seo_desc_counter', 160);
            });

            if (seoTitle) updateCounter(seoTitle, 'seo_title_counter', 70);
            if (seoDesc) updateCounter(seoDesc, 'seo_desc_counter', 160);
        });

        let sno = 0;
        const disableFieldsCategoryIds = [
            3,
            5,
            6
        ];

        function shouldDisableBedroomsAndBathrooms(categoryId) {
            return disableFieldsCategoryIds.includes(categoryId.toString());
        }

        function toggleBedroomsAndBathrooms(categoryId) {
            const disable = shouldDisableBedroomsAndBathrooms(categoryId);
            $('#dynamic-extras .property-extra-row').each(function() {
                $(this).find('input[name="new_extras_bed[]"]').prop('disabled', disable);
                $(this).find('input[name="new_extras_bath[]"]').prop('disabled', disable);
            });
        }

        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('input, select, textarea').forEach(function(el) {
                const errorDiv = document.getElementById(el.id + '_error');
                if (!errorDiv) return;

                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.addEventListener('input', function() {
                        errorDiv.textContent = '';
                    });
                }
                if (el.tagName === 'SELECT') {
                    el.addEventListener('change', function() {
                        errorDiv.textContent = '';
                    });
                }
            });
        });

        function addRow() {
            sno++;
            const currentCategoryId = $('#category_id').val();
            const disable = shouldDisableBedroomsAndBathrooms(currentCategoryId);
            let html = `
                <div class="card mt-1 property-extra-row" style="background: aliceblue; padding: 3%;" id="new_extra_${sno}">
                    <button type="button" class="close-btn" onclick="removeExtraRow(this, null)">❌</button>
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" class="form-control" name="new_extras_name[]" required>
                        <span class="text-danger error-message" style="display:none;"></span>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea class="form-control" name="new_extras_description[]" rows="4"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Image (Max 2MB, JPEG/PNG/JPG/PDF)</label>
                        <input type="file" class="form-control" name="new_extras_img[]" accept="image/png,image/jpeg,image/jpg,application/pdf">
                    </div>
                    <div class="form-group" style="${disable ? 'display:none;' : ''}>
                        <label>Bedrooms</label>
                        <input type="text" class="form-control" name="new_extras_bed[]" ${disable ? 'disabled' : ''}>
                    </div>
                    <div class="form-group" style="${disable ? 'display:none;' : ''}>
                        <label>Bathrooms</label>
                        <input type="text" class="form-control" name="new_extras_bath[]" ${disable ? 'disabled' : ''}>
                    </div>
                </div>
            `;
            $('#dynamic-extras').append(html);
        }

        function removeExtraRow(button, extraId) {
            if (extraId && !confirm('Are you sure you want to delete this extra?')) return;
            const row = $(button).closest('.property-extra-row');
            if (extraId) {
                row.find(`input[name="extras_id[]"][value="${extraId}"]`).remove();
                const input = $(`<input type="hidden" name="deleted_extras_ids[]" value="${extraId}">`);
                $('#propertyForm').append(input);
            }
            row.remove();
        }

        let currentStep = 1;
        const totalSteps = 5;

        function updateFormSteps() {
            $('.form-step').addClass('d-none');
            $(`#step-${currentStep}`).removeClass('d-none');
            $('#prevBtn').toggle(currentStep > 1);
            $('#nextBtn').toggle(currentStep < totalSteps);
            $('#submitBtn').toggle(currentStep === totalSteps);

            if (currentStep === 3) {
                const selectedStateId = $('#state').val();
                if (selectedStateId && $('#city option').length <= 1) {
                    const selectedCityId = $('#city').data('selected');
                    loadCities(selectedStateId, selectedCityId);
                }
            }

            updateStepperUI();
        }

        function updateStepperUI() {
            $('.stepper li').removeClass('active completed').removeAttr('aria-current');
            $('.stepper li').each(function(index) {
                if (index + 1 < currentStep) {
                    $(this).addClass('completed');
                } else if (index + 1 === currentStep) {
                    $(this).addClass('active').attr('aria-current', 'step');
                }
            });
        }

        function validateStep(step) {
            const stepElement = document.querySelector(`#step-${step}`);
            const inputs = stepElement.querySelectorAll(
                'input[required]:not([type="radio"]):not([type="checkbox"]), select[required], textarea[required]');
            let valid = true;
            inputs.forEach(input => {
                const errorDiv = document.getElementById(input.id + '_error');
                if (errorDiv) errorDiv.textContent = '';

                if (!input.value.trim()) {
                    valid = false;
                    if (errorDiv) errorDiv.textContent = 'This field is required';
                }
            });

            if (step === 4) {
                const facilityRows = stepElement.querySelectorAll('.facility-row');
                facilityRows.forEach((row, index) => {
                    const facilitySelect = row.querySelector('select[name="facility_ids[]"]');
                    const facilityValue = row.querySelector('input[name="facility_values[]"]');
                    if (facilitySelect && facilityValue) {
                        if (facilitySelect.value && facilitySelect.value !== "" && facilitySelect.value !==
                            "Select Facilities") {
                            if (!facilityValue.value || facilityValue.value.trim() === "") {
                                showError(facilityValue, "Please enter a distance value for the selected facility");
                                valid = false;
                            } else {
                                clearError(facilityValue);
                            }
                        }

                        if (facilityValue.value && facilityValue.value.trim() !== "") {
                            if (!facilitySelect.value || facilitySelect.value === "" || facilitySelect.value ===
                                "Select Facilities") {
                                showError(facilitySelect, "Please select a facility type");
                                valid = false;
                            } else {
                                clearError(facilitySelect);
                            }
                        }
                    }
                });
            }

            return valid;
        }

        const existingFieldValues = @json($existingFieldValues);
        const style = document.createElement('style');
        style.innerHTML = `
            .custom-fields-section {
                margin-top: 20px;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #dee2e6;
            }
            .form-label {
                font-weight: 600;
                color: #495057;
                margin-bottom: 8px;
            }
            .radio-group {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                margin-bottom: 10px;
            }
            .form-check-inline {
                margin-right: 0;
                padding: 8px 12px;
                border-radius: 5px;
                transition: all 0.2s ease;
            }
            .form-check-inline:hover {
                background-color: #e9ecef;
                cursor: pointer;
            }
            .form-check-input:checked + .form-check-label {
                font-weight: 600;
                color: #007bff;
            }
            .form-check-input:checked {
                background-color: #007bff;
                border-color: #007bff;
            }
            .sub-fields-container {
                margin-top: 15px;
                padding: 15px;
                border-radius: 6px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            .sub-fields {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
            }
            .sub-field {
                flex: 1 1 300px;
                min-width: 250px;
            }
            .sub-field label {
                font-size: 0.95rem;
                color: #343a40;
            }
            .sub-field input {
                border-radius: 5px;
                border: 1px solid #ced4da;
                padding: 8px;
                font-size: 0.95rem;
            }
            .sub-field input:focus {
                border-color: #007bff;
                box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
                outline: none;
            }
            .text-danger {
                color: #dc3545 !important;
            }
            @media (max-width: 768px) {
                .sub-field {
                    flex: 1 1 100%;
                }
            }
        `;
        document.head.appendChild(style);

        function fetchCustomFields(categoryId) {
            if (!categoryId) {
                $('#customFieldsContainer').html('');
                console.warn('No category ID provided for custom fields');
                return;
            }
            $.ajax({
                url: '/get-custom-fields/' + categoryId,
                method: 'GET',
                success: function(data) {
                    console.log('Custom fields fetched:', data);
                    if (data.success) {
                        renderFields(data.fields);
                    } else {
                        $('#customFieldsContainer').html(
                            '<p class="text-danger">No fields found for this category.</p>');
                    }
                },
                error: function(xhr) {
                    console.error('Failed to fetch custom fields:', xhr);
                    $('#customFieldsContainer').empty();
                }
            });
            toggleBedroomsAndBathrooms(categoryId);
        }

        function renderFields(fields) {
            const container = $('#customFieldsContainer').html('');
            let html = '<div class="custom-fields-section"><div class="row g-3">';

            function convertStringToNumberIfNeeded(value) {
                if (typeof value === 'string' && !isNaN(Number(value))) {
                    return Number(value);
                }
                return value;
            }

            fields.forEach(field => {
                const fieldLabel = field.field_label || '';
                const sanitizedLabel = fieldLabel ? fieldLabel.replace(/\s+/g, '_') : 'field_' + field.id;
                const inputBase = `custom_fields[${sanitizedLabel}]`;
                const requiredMark = field.is_required ? `<span class="text-danger">*</span>` : "";
                const existingValue = existingFieldValues?.[fieldLabel]?.value || "";

                if (field.field_type !== "radio" && fieldLabel) {
                    html += `<div class="col-md-3">`;
                    html += `<label class="form-label">${fieldLabel} ${requiredMark}</label>`;
                    if (["text", "number"].includes(field.field_type)) {
                        html +=
                            `<input type="${field.field_type}" class="form-control" name="${inputBase}[value]" value="${existingValue}" ${field.is_required ? "required" : ""}>`;
                    } else if (field.field_type === "checkbox") {
                        const checked = existingValue == 1 || existingValue === true ? "checked" : "";
                        html += `<div class="form-check">
                            <input type="checkbox" class="form-check-input" name="${inputBase}[value]" value="1" ${checked} ${field.is_required ? "required" : ""}>
                            <label class="form-check-label">${fieldLabel}</label>
                        </div>`;
                    }
                    html += `
                <input type="hidden" name="${inputBase}[input_type]" value="${field.field_type}">
                <input type="hidden" name="${inputBase}[is_required]" value="${field.is_required ? 1 : 0}">
                <input type="hidden" name="${inputBase}[original_label]" value="${fieldLabel}">
                <span class="text-danger error-message" style="display:none;"></span>
            `;
                    html += `</div>`;
                }

                if (field.field_type === "radio" && Array.isArray(field.radio_options)) {
                    html += `<div class="col-md-12">`;
                    const displayLabel = fieldLabel || 'Select Option';
                    if (displayLabel) {
                        html += `<label class="form-label">${displayLabel} ${requiredMark}</label>`;
                    }
                    html += `<div class="radio-group">`;
                    field.radio_options.forEach(opt => {
                        const id = `field_${sanitizedLabel}_${opt.name}`.replace(/\s+/g, "_");
                        const isCurrentValue = existingValue === opt.name;
                        const isDisabled = (existingValue !== "" && !isCurrentValue);
                        const checked = isCurrentValue ? "checked" : "";
                        const disabledAttr = isDisabled ? "disabled" : "";
                        const requiredAttr = field.is_required ? "required" : "";
                        const labelOnClick = isDisabled ?
                            `onclick="showAlertOnDisabledCustomFieldRadio(event, '${inputBase}[value]', '${existingValue}')"` :
                            "";

                        html += `
                <div class="form-check form-check-inline">
                    <input type="radio" class="form-check-input custom-field-radio" id="${id}" name="${inputBase}[value]" value="${opt.name}" ${checked} ${requiredAttr} ${disabledAttr} onclick="toggleRadioFields('${id}', '${opt.name}')">
                    <label class="form-check-label" for="${id}" ${labelOnClick}>${opt.name}</label>
                </div>`;
                    });
                    html += `</div>`;
                    html +=
                        `<div id="sub_fields_${sanitizedLabel}" class="sub-fields-container sub-fields" style="display:none;"></div>`;
                    html += `
                <input type="hidden" name="${inputBase}[input_type]" value="${field.field_type}">
                <input type="hidden" name="${inputBase}[is_required]" value="${field.is_required ? 1 : 0}">
                <input type="hidden" name="${inputBase}[original_label]" value="${fieldLabel}">
                <span class="text-danger error-message" style="display:none;"></span>
            `;
                    html += `</div>`;
                }

                if (field.has_unit === 1 || fieldLabel === 'Plot Area') {
                    let existingUnitForCurrentField = existingFieldValues?.[fieldLabel]?.unit || "";
                    existingUnitForCurrentField = convertStringToNumberIfNeeded(existingUnitForCurrentField);

                    html += `
            <div class="col-md-3">
                <label for="unit_${sanitizedLabel}" class="form-label">Unit <span class="text-danger">*</span></label>
                <select class="form-select" id="unit_${sanitizedLabel}" name="custom_field_units[${sanitizedLabel}]" required>
                    <option value="">Select Unit</option>
                    <option value="1" ${existingUnitForCurrentField == 1 ? "selected" : ""}>Sq. Ft</option>
                    <option value="2" ${existingUnitForCurrentField == 2 ? "selected" : ""}>Square Inches</option>
                    <option value="3" ${existingUnitForCurrentField == 3 ? "selected" : ""}>Acres</option>
                    <option value="4" ${existingUnitForCurrentField == 4 ? "selected" : ""}>Cents</option>
                    <option value="5" ${existingUnitForCurrentField == 5 ? "selected" : ""}>Square Meters</option>
                    <option value="6" ${existingUnitForCurrentField == 6 ? "selected" : ""}>Square Yards</option>
                    <option value="7" ${existingUnitForCurrentField == 7 ? "selected" : ""}>Hectares</option>
                </select>
            </div>`;
                }
                if (Array.isArray(field.additional_fields) && field.additional_fields.length > 0) {
                    field.additional_fields.forEach(extra => {
                        const extraSanitized = extra.label.replace(/\s+/g, "_");
                        const extraName = `custom_fields_extra[${extraSanitized}]`;
                        const existingExtraValue = existingFieldValues?.[extra.label]?.value || "";
                        const isBreadthForLand = extra.label === 'Plot Breadth';
                        const requiredAttr = (extra.required === "1" && !isBreadthForLand) ? 'required' : '';

                        html += `
                <div class="col-md-3">
                    <label class="form-label">${extra.label}${(extra.required === "1" && !isBreadthForLand) ? ' <span class="text-danger">*</span>' : ''}</label>
                    <input type="${extra.type}" class="form-control" name="${extraName}[value]" value="${existingExtraValue}" ${requiredAttr}>
                    <input type="hidden" name="${extraName}[input_type]" value="${extra.type}">
                    <input type="hidden" name="${extraName}[is_required]" value="${extra.required === "1" ? 1 : 0}">
                    <input type="hidden" name="${extraName}[original_label]" value="${extra.label}">
                    <span class="text-danger error-message" style="display:none;"></span>
                </div>`;

                        if (extra.has_unit === 1) {
                            const existingExtraUnit = existingFieldValues?.[extra.label]?.unit || "";
                            const convertedExtraUnit = convertStringToNumberIfNeeded(existingExtraUnit);
                            html += `
                    <div class="col-md-3">
                        <label for="unit_${extraSanitized}" class="form-label">Unit <span class="text-danger">*</span></label>
                        <select class="form-select" id="unit_${extraSanitized}" name="custom_field_units[${extraSanitized}]" required>
                            <option value="1" ${convertedExtraUnit == 1 ? "selected" : ""}>Sq. Ft</option>
                            <option value="2" ${convertedExtraUnit == 2 ? "selected" : ""}>Square Inches</option>
                            <option value="3" ${convertedExtraUnit == 3 ? "selected" : ""}>Acres</option>
                            <option value="4" ${convertedExtraUnit == 4 ? "selected" : ""}>Cents</option>
                            <option value="5" ${convertedExtraUnit == 5 ? "selected" : ""}>Square Meters</option>
                            <option value="6" ${convertedExtraUnit == 6 ? "selected" : ""}>Square Yards</option>
                            <option value="7" ${convertedExtraUnit == 7 ? "selected" : ""}>Hectares</option>
                        </select>
                    </div>`;
                        }
                    });
                }
            });
            html += `</div></div>`;
            container.html(html);

            fields.forEach(field => {
                const fieldLabel = field.field_label || '';
                if (field.field_type === "radio" && Array.isArray(field.radio_options)) {
                    const savedValue = existingFieldValues?.[fieldLabel]?.value || null;
                    if (savedValue) {
                        const sanitizedLabel = fieldLabel ? fieldLabel.replace(/\s+/g, '_') : 'field_' + field.id;
                        const id = `field_${sanitizedLabel}_${savedValue}`.replace(/\s+/g, "_");
                        if (!($(`#${id}`).prop('disabled'))) {
                            toggleRadioFields(id, savedValue);
                        }
                    }
                }
            });
        }

        function showAlertOnDisabledCustomFieldRadio(event, nameAttribute, currentValue) {
            event.preventDefault();
            alert(`The selected option ${currentValue} cannot be changed`);
            $(`input[name="${nameAttribute}"][value="${currentValue}"]`).prop('checked', true);
        }

        function convertStringToNumberIfNeeded(value) {
            if (typeof value === 'string' && !isNaN(Number(value))) {
                return Number(value);
            }
            return value;
        }

        function toggleRadioFields(radioId, radioName) {
            const sanitizedLabel = radioId.split('_').slice(1, -1).join('_');
            const subFieldsContainer = $(`#sub_fields_${sanitizedLabel}`);
            $('.sub-fields').html('').hide();

            if (!subFieldsContainer.length) {
                console.warn(`Subfields container #sub_fields_${sanitizedLabel} not found`);
                return;
            }

            const categoryId = $('[name="category_id"]:checked').val();
            if (!categoryId) {
                console.warn('No category ID selected for fetching radio subfields');
                return;
            }

            $.ajax({
                url: '/get-custom-fields/' + categoryId,
                method: 'GET',
                success: function(data) {
                    if (data.success) {
                        const radioField = data.fields.find(f => f.field_type === "radio" && (f.field_label ||
                            'field_' + f.id).replace(/\s+/g, '_') === sanitizedLabel);

                        if (!radioField) {
                            console.warn(
                            'No matching radio field found in fetched custom fields for subfields');
                            return;
                        }

                        const selectedOption = radioField.radio_options.find(opt => opt.name === radioName);

                        if (selectedOption && Array.isArray(selectedOption.fields)) {
                            let html = '';
                            selectedOption.fields.forEach(subField => {
                                const subSanitized = subField.label.replace(/\s+/g, '_');
                                const subInputBase = `custom_fields[${subSanitized}]`;
                                const existingSubValue = existingFieldValues?.[subField.label]?.value ||
                                    "";
                                html += `
                        <div class="col-md-3">
                            <label class="form-label">${subField.label}${subField.required === "1" ? ' <span class="text-danger">*</span>' : ''}</label>
                            <input type="${subField.type}" class="form-control" name="${subInputBase}[value]" value="${existingSubValue}" ${subField.required === "1" ? "required" : ""}>
                            <input type="hidden" name="${subInputBase}[input_type]" value="${subField.type}">
                            <input type="hidden" name="${subInputBase}[is_required]" value="${subField.required === "1" ? 1 : 0}">
                            <input type="hidden" name="${subInputBase}[original_label]" value="${subField.label}">
                            <span class="text-danger error-message" style="display:none;"></span>
                        </div>`;
                                if (subField.has_unit === 1) {
                                    let existingSubUnit = existingFieldValues?.[subField.label]?.unit ||
                                        "";
                                    existingSubUnit = convertStringToNumberIfNeeded(existingSubUnit);

                                    html += `
                            <div class="col-md-3">
                                <label for="unit_${subSanitized}" class="form-label">Unit <span class="text-danger">*</span></label>
                                <select class="form-select" id="unit_${subSanitized}" name="custom_field_units[${subSanitized}]" required>
                                    <option value="1" ${existingSubUnit == 1 ? "selected" : ""}>Sq. Ft</option>
                                    <option value="2" ${existingSubUnit == 2 ? "selected" : ""}>Square Inches</option>
                                    <option value="3" ${existingSubUnit == 3 ? "selected" : ""}>Acres</option>
                                    <option value="4" ${existingSubUnit == 4 ? "selected" : ""}>Cents</option>
                                    <option value="5" ${existingSubUnit == 5 ? "selected" : ""}>Square Meters</option>
                                    <option value="6" ${existingSubUnit == 6 ? "selected" : ""}>Square Yards</option>
                                    <option value="7" ${existingSubUnit == 7 ? "selected" : ""}>Hectares</option>
                                </select>
                            </div>`;
                                }
                            });
                            subFieldsContainer.html(html).css({
                                display: 'flex',
                                flexWrap: 'wrap'
                            });
                        } else {
                            console.log('No subfields found for selected radio option:', radioName);
                        }
                    } else {
                        console.warn('Failed to fetch custom fields for subfields:', data);
                        subFieldsContainer.html('<p class="text-danger">Failed to load subfields.</p>');
                    }
                },
                error: function(xhr) {
                    console.error('Failed to fetch radio subfields:', xhr);
                    subFieldsContainer.html('<p class="text-danger">Failed to load subfields.</p>');
                }
            });
        }

        function toggleLastOption() {
            const neverExpired = $('#neverExpiredToggle').is(':checked');
            $('#lastToggle').css('display', neverExpired ? 'none' : 'block');
            if (neverExpired) {
                $('input[name="renew_24_hours"]').prop('checked', true);
            }
        }

        const facilityOptions = `
            <option value="">Select Facilities</option>
            @foreach ($product_cate as $item)
                <option value="{{ $item->id }}">{{ $item->name }}</option>
            @endforeach
        `;

        function addNewRow() {
            const container = $('#facilitiesContainer');
            const newRow = $(`
                    <div class="row facility-row mb-2">
                        <div class="col-md-5">
                            <div class="form-group">
                                <select class="form-control" name="facility_ids[]" required>
                                    ${facilityOptions}
                                </select>
                                <span class="text-danger error-message" style="display:none;"></span>
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="form-group position-relative mb-4">
                                <input type="text" class="form-control facility-value-input mb-1"
                                    name="facility_values[]"
                                    maxlength="50"
                                    placeholder="Distance (E.g: 200m , 1km..) from here">
                                <small class="char-counter text-muted" style="position:absolute;right:10px;bottom:-20px;">50/50</small>
                                <span class="text-danger error-message" style="display:none;"></span>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <button type="button" class="btn btn-outline-dark" onclick="removeRow(this, null)">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>`);
            container.append(newRow);

            const input = newRow.find('.facility-value-input')[0];
            if (input) {
                const counter = newRow.find('.char-counter')[0];
                if (counter) {
                    input.addEventListener('input', function() {
                        const max = input.getAttribute('maxlength') || 50;
                        const len = input.value.length;
                        counter.textContent = (max - len) + '/' + max;
                    });
                    counter.textContent = (input.getAttribute('maxlength') || 50) + '/50';
                }
            }

            const facilitySelect = newRow.find('select[name="facility_ids[]"]')[0];
            const facilityValue = newRow.find('input[name="facility_values[]"]')[0];
            if (facilitySelect && facilityValue) {
                facilitySelect.addEventListener('change', function() {
                    validateFacilityField(this, facilityValue);
                });

                facilityValue.addEventListener('input', function() {
                    validateFacilityField(facilitySelect, this);
                });
            }
        }
        window.removeRow = function(button, facilityId) {
            if (facilityId && !confirm('Are you sure you want to delete this facility?')) return;
            const row = $(button).closest('.facility-row');
            if (facilityId) {
                const input = $(`<input type="hidden" name="deleted_facility_ids[]" value="${facilityId}">`);
                $('#propertyForm').append(input);
            }
            row.remove();
        }

        function loadCities(stateId, selectedCityId = null) {
            $('#city').html('<option value="">Select City</option>');
            $('.city-error').remove();
            if (stateId) {
                $.ajax({
                    url: '/get-cities/' + stateId,
                    method: 'GET',
                    success: function(data) {
                        $.each(data, function(key, city) {
                            const isSelected = selectedCityId == city.id ? 'selected' : '';
                            $('#city').append(
                                `<option value="${city.id}" ${isSelected}>${city.name}</option>`);
                        });
                    },
                    error: function(xhr) {
                        $('.city-error').remove();
                        $('#city').after(
                            '<p class="text-danger city-error">Failed to load cities. <button type="button" class="btn btn-link p-0">Retry</button></p>'
                        );
                    }
                });
            }
        }

        function updateRadioIcons(selector, inputName) {
            $(selector).each(function() {
                const label = $(this).closest('.form-check').find('.check-icon');
                if (label.length) {
                    label.css('display', this.checked ? 'inline' : 'none');
                } else {
                    console.warn('Check icon missing for', this);
                }
            });
        }

        function convertNumberToWords(amount) {
            const words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
                'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
            ];
            const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

            if (amount === 0) return 'Zero Rupees Only';
            if (amount > 999999999999999) return 'Amount too large to convert';

            function _convertToWordsRecursive(num) {
                if (num === 0) return '';

                if (num < 20) {
                    return words[num];
                } else if (num < 100) {
                    return (tens[Math.floor(num / 10)] + ' ' + words[num % 10]).trim();
                } else if (num < 1000) {
                    return (words[Math.floor(num / 100)] + ' Hundred ' + _convertToWordsRecursive(num % 100)).trim();
                } else if (num < 100000) {
                    return (_convertToWordsRecursive(Math.floor(num / 1000)) + ' Thousand ' + _convertToWordsRecursive(num %
                        1000)).trim();
                } else if (num < 10000000) {
                    return (_convertToWordsRecursive(Math.floor(num / 100000)) + ' Lakh ' + _convertToWordsRecursive(num %
                        100000)).trim();
                } else {
                    return (_convertToWordsRecursive(Math.floor(num / 10000000)) + ' Crore ' + _convertToWordsRecursive(
                        num % 10000000)).trim();
                }
            }

            return _convertToWordsRecursive(amount) + ' Rupees Only';
        }

        function formatAndConvert(value) {
            let cleanValue = value.replace(/[^\d]/g, '');
            if (cleanValue.length > 12) cleanValue = cleanValue.slice(0, 12);
            if (cleanValue === '') {
                $('#price_in_words').val('');
                return '';
            }
            let number = parseInt(cleanValue, 10);
            if (isNaN(number)) {
                $('#price_in_words').val('');
                return '';
            }
            $('#price_in_words').val(convertNumberToWords(number));
            return number.toLocaleString('en-IN', {
                minimumFractionDigits: 0
            });
        }

        function cleanPriceInput() {
            let cleanValue = $('#price').val().replace(/[^\d]/g, '') || '0';
            $('#price').val(cleanValue);
            return cleanValue;
        }

        function formatIndianCurrency(x) {
            x = x.toString();
            const lastThree = x.substring(x.length - 3);
            const otherNumbers = x.substring(0, x.length - 3);
            if (otherNumbers !== '') {
                return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ',' + lastThree;
            }
            return lastThree;
        }

        function showErrors(errors) {
            $('.error-message').hide().text('');
            $.each(errors, function(field, messages) {
                const input = $(`[name="${field}"], [name*="${field}["]`);
                if (input.length) {
                    input.next('.error-message').text(messages.join(', ')).show();
                } else {
                    $('#propertyForm').prepend(
                        `<div class="alert alert-danger">${field}: ${messages.join(', ')}</div>`);
                }
            });
            alert('Please fix the errors and try again.');
        }

        $(document).ready(function() {
            $('#propertyForm').on('submit', function(e) {
                const selectedOwnerType = document.querySelector('input[name="owner_type"]:checked');
                if (selectedOwnerType && selectedOwnerType.value === 'Consultant') {
                    const permalinkInput = document.getElementById('permalink');
                    if (permalinkInput) {
                        permalinkInput.value = '';
                    }
                }

                if (!$(this).data('ajax-submission')) {
                    if (selectedFiles.length > 0) {
                        syncFileInput();
                    }
                }
            });
            updateFormSteps();
            $('#nextBtn').click(function() {
                if (window.isPropertyViewMode) {
                    if (currentStep < totalSteps) {
                        currentStep++;
                        updateFormSteps();
                    }
                    return;
                }
                if (currentStep < totalSteps && validateStep(currentStep)) {
                    currentStep++;
                    updateFormSteps();
                }
            });
            $('#prevBtn').click(function() {
                if (currentStep > 1) {
                    currentStep--;
                    updateFormSteps();
                }
            });
            $('#propertyForm').on('submit', function(e) {
                e.preventDefault();
                if (window.isPropertyViewMode) {
                    alert('This property is pending approval and cannot be edited.');
                    return false;
                }

                const selectedOwnerType = document.querySelector('input[name="owner_type"]:checked');
                if (selectedOwnerType && selectedOwnerType.value === 'Consultant') {
                    const permalinkInput = document.getElementById('permalink');
                    if (permalinkInput) {
                        permalinkInput.value = ''; 
                    }
                }

                if (selectedFiles.length > 0) {
                    updateFileInput();
                }

                if (validateStep(currentStep)) {
                    $('#propertyForm').data('ajax-submission', true);
                    updateProperty();
                }
            });

            const categoryId = $('#category_id').val();
            if (categoryId) {
                fetchCustomFields(categoryId);
            }

            $('#neverExpiredToggle').on('change', toggleLastOption);
            toggleLastOption();

            $('#state').on('change', function() {
                console.log('State changed:', $(this).val());
                const stateId = $(this).val();
                console.log('Loading cities for state ID:', stateId);
                if (stateId) {
                    loadCities(stateId);
                } else {
                    $('#city').html('<option value="">Select City</option>');
                }
            });
            $(document).on('click', '.city-error button', function() {
                const stateId = $('#state').val();
                const selectedCityId = $('#city').data('selected');
                loadCities(stateId, selectedCityId);
            });

            const existingStateId = $('#state').val();
            console.log('Existing state ID:', existingStateId);
            const existingCityId = $('#city').data('selected');
            console.log('Existing city ID:', existingCityId);
            if (existingStateId) {
                loadCities(existingStateId, existingCityId);
            }

            updateRadioIcons('input[name="owner_type"]', 'owner_type');
            updateRadioIcons('input[name="category_id"]', 'category_id');
            $('input[name="owner_type"], input[name="category_id"]').on('change', function() {
                updateRadioIcons(`input[name="${this.name}"]`, this.name);
            });

            $('.feature-checkbox').on('change', function() {
                const tickIcon = $(this).next().find('.tick-icon');
                tickIcon.css('display', this.checked ? 'inline' : 'none');
            });

            var selectedRegions = @json(array_values($oldRegionsValues));

            const $tagInput = $('#tag-input');
            const $tagContainer = $('#tag-container');
            const $regionInput = $('#region-input');

            function createTagElement(region) {
                return $(
                    '<span class="tag" style="background:#6c757d61; color:#fff; padding:3px 8px; border-radius:12px; display:inline-flex; align-items:center; font-size:14px;">' +
                    $('<div>').text(region).html() +
                    ' <span class="remove" style="cursor:pointer; margin-left:5px;">&times;</span></span>');
            }

            function renderAllTags() {
                $tagContainer.find('.tag').remove();

                selectedRegions.forEach(function(region) {
                    if (typeof region === 'string' && region.trim() !== '') {
                        let $tag = createTagElement(region);
                        $tag.insertBefore($tagInput);
                    }
                });

                $regionInput.val(JSON.stringify(selectedRegions));
                if (selectedRegions.length >= 10) {
                    $tagInput.prop('disabled', true).attr('placeholder', 'Max 10 tags reached');
                } else {
                    $tagInput.prop('disabled', false).attr('placeholder', 'Type and press Enter');
                }
            }

            renderAllTags();

            $tagInput.on('keypress', function(e) {
                if (e.which === 13) { 
                    e.preventDefault(); 
                    let tagText = $(this).val().trim();
                    if (tagText && !selectedRegions.includes(tagText) && selectedRegions.length < 10) {
                        selectedRegions.push(tagText); 
                        $(this).val('');
                        renderAllTags();
                    } else if (selectedRegions.length >= 10) {}
                }
            });

            $tagContainer.on('click', '.remove', function() {
                let tagText = $(this).parent().contents().filter(function() {
                    return this.nodeType === 3; 
                }).text().trim();

                selectedRegions = selectedRegions.filter(region => region !== tagText);

                renderAllTags();
            });
            if ($('#price').val().trim() !== '') {
                let raw = $('#price').val().replace(/[^\d]/g, '');
                $('#price').val(parseInt(raw, 10).toLocaleString('en-IN'));
                $('#price_in_words').val(convertNumberToWords(parseInt(raw, 10)));
            }
            $('#price').on('input', function() {
                let cursorPos = this.selectionStart;
                let oldLength = this.value.length;
                let value = this.value.replace(/[^\d]/g, '');
                let formatted = formatAndConvert(value);
                this.value = formatted || '';
                let newLength = this.value.length;
                cursorPos = cursorPos + (newLength - oldLength);
                this.setSelectionRange(cursorPos, cursorPos);
            });
            $('#images').on('change', previewImages);

            $(document).ready(function() {
                let attempts = 0;
                const maxAttempts = 10;

                function initializeImageCount() {
                    const existingImages = $('#existingImagePreviewContainer .image-preview:not(:hidden)')
                        .length;
                    console.log('Attempt', attempts, 'Existing images found:', existingImages);

                    if (existingImages > 0 || attempts >= maxAttempts) {
                        updateImageLimit();
                        updateImageCount();
                    } else {
                        attempts++;
                        setTimeout(initializeImageCount, 200);
                    }
                }

                const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList' && mutation.target.id ===
                            'existingImagePreviewContainer') {
                            updateImageCount();
                        }
                    });
                });

                const existingContainer = document.getElementById('existingImagePreviewContainer');
                if (existingContainer) {
                    observer.observe(existingContainer, {
                        childList: true,
                        subtree: true
                    });
                }

                initializeImageCount();
            });

            $(window).on('load', function() {
                updateImageLimit(); 
                updateImageCount();
            });

            $(document).ready(function() {
                $('input[name="owner_type"]').on('change', function() {
                    updateImageLimit();
                });
                $('#image-success-message').hide();
            });
            $(document).on('submit', '#propertyForm', function() {
                $('#image-success-message').hide();
            });
        });
    </script>
    
    <style>
        #file-size-warning.text-warning {
            background-color: #fff3cd !important;
            border: 1px solid #ffeaa7 !important;
            color: #856404 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
            font-size: 12px !important;
        }

        #image-upload-info.text-info {
            background-color: #d1ecf1 !important;
            border: 1px solid #bee5eb !important;
            color: #0c5460 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
            font-size: 12px !important;
        }

        #image-success-message.text-success {
            background-color: #d4edda !important;
            border: 1px solid #c3e6cb !important;
            color: #155724 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
            font-size: 12px !important;
        }

        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        input[type="number"] {
            -moz-appearance: textfield;
            appearance: textfield;
        }

        #seo-file-size-warning.text-warning {
            background-color: #fff3cd !important;
            border: 1px solid #ffeaa7 !important;
            color: #856404 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
            font-size: 12px !important;
        }

        #seo-image-upload-info.text-info {
            background-color: #d1ecf1 !important;
            border: 1px solid #bee5eb !important;
            color: #0c5460 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
            font-size: 12px !important;
        }

        #seo-image-success-message.text-success {
            background-color: #d4edda !important;
            border: 1px solid #c3e6cb !important;
            color: #155724 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
            font-size: 12px !important;
        }

        #video-thumbnail-file-size-warning.text-warning {
            background-color: #fff3cd !important;
            border: 1px solid #ffeaa7 !important;
            color: #856404 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
            font-size: 12px !important;
        }

        #video-thumbnail-upload-info.text-info {
            background-color: #d1ecf1 !important;
            border: 1px solid #bee5eb !important;
            color: #0c5460 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
            font-size: 12px !important;
        }

        #video-thumbnail-success-message.text-success {
            background-color: #d4edda !important;
            border: 1px solid #c3e6cb !important;
            color: #155724 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            margin-top: 8px !important;
            font-size: 12px !important;
        }
    </style>
    
    <script>
        let selectedFiles = [];
        let currentImageLimit = 15;
        const imageLimits = {
            'Owner': 15,
            'Builder': 15,
            'Consultant': 5
        };

        function updateImageLimit() {
            const selected = document.querySelector('input[name="owner_type"]:checked');
            if (selected && imageLimits[selected.value]) {
                currentImageLimit = imageLimits[selected.value];
                $('#image-limit-text').text(`Up to ${currentImageLimit} images`);
                $('#image-limit-display').text(currentImageLimit);
                $('#images').attr('data-max-files', currentImageLimit);
                if (selectedFiles.length > currentImageLimit) {
                    selectedFiles = selectedFiles.slice(0, currentImageLimit);
                    $('#image-limit-warning').show();
                    $('#image-limit-message').text(
                        `Image limit changed. Only the first ${currentImageLimit} images will be kept.`);
                    $('#images').addClass('is-invalid');
                    setTimeout(() => {
                        $('#image-limit-warning').hide();
                        $('#images').removeClass('is-invalid');
                    }, 3000);
                }
                updateImagePreview();
                updateImageCount();
                $('#image-limit-display').text(currentImageLimit);
            }
        }

        function updateImageCount() {
            const existingImages = $('#existingImagePreviewContainer .image-preview:not(:hidden)').length;
            const newImages = selectedFiles.length;
            const totalCount = existingImages + newImages;
            $('#image-count').text(totalCount);

            if (totalCount > currentImageLimit) {
                $('#image-limit-warning').show();
                $('#image-limit-message').text(
                    `You can only have up to ${currentImageLimit} images total. Please remove ${totalCount - currentImageLimit} image(s).`
                    );
                $('#images').addClass('is-invalid');
            } else {
                $('#image-limit-warning').hide();
                $('#images').removeClass('is-invalid');
            }
        }

        function updateImagePreview() {
            const previewContainer = $('#newImagePreviewContainer').html('');
            selectedFiles.forEach((file, index) => {
                if (index >= currentImageLimit) return;

                const reader = new FileReader();
                reader.onload = function(e) {
                    const imageDiv = $(`
                        <div class="image-preview" id="new-image-${index}">
                            <img src="${e.target.result}" alt="Image Preview" class="img-thumbnail" width="100">
                            <button type="button" class="remove-btn" onclick="removeNewImage(${index})">×</button>
                        </div>`);
                    previewContainer.append(imageDiv);
                };
                reader.readAsDataURL(file);
            });
        }

        function previewImages() {
            const inputFiles = Array.from($('#images')[0].files);
            if (!inputFiles.length) return;
            $('#file-size-warning').hide();
            $('#image-success-message').hide();
            const existingImages = $('#existingImagePreviewContainer .image-preview:not(:hidden)').length;
            const totalFiles = existingImages + selectedFiles.length + inputFiles.length;
            const maxFileSize = 2 * 1024 * 1024;
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const allowedExtensions = ['.jpg', '.jpeg', '.png'];
            let validFiles = [];
            let invalidFiles = [];
            inputFiles.forEach(file => {
                const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
                const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
                const isValidSize = file.size <= maxFileSize;

                if (isValidType && isValidSize) {
                    if (!selectedFiles.find(f => f.name === file.name && f.lastModified === file.lastModified)) {
                        validFiles.push(file);
                    }
                } else {
                    let reason = '';
                    if (!isValidType && !isValidSize) {
                        reason = 'both';
                    } else if (!isValidType) {
                        reason = 'type';
                    } else {
                        reason = 'size';
                    }
                    invalidFiles.push({
                        file,
                        reason
                    });
                }
            });

            if (invalidFiles.length > 0) {
                let warningMessage = '';
                const hasTypeErrors = invalidFiles.some(f => f.reason === 'type' || f.reason === 'both');
                const hasSizeErrors = invalidFiles.some(f => f.reason === 'size' || f.reason === 'both');

                if (hasTypeErrors && hasSizeErrors) {
                    warningMessage = 'Some files were rejected: Invalid file type and size greater than 2MB.';
                } else if (hasTypeErrors) {
                    warningMessage = 'Some files were rejected: Invalid file type. Only JPEG/PNG images are allowed.';
                } else {
                    warningMessage = 'Some files were rejected: Size greater than 2MB.';
                }

                $('#file-size-message').text(warningMessage);
                $('#file-size-warning').show();

                setTimeout(() => {
                    $('#file-size-warning').hide();
                }, 5000);
            }

            if (validFiles.length > 0) {
                if (totalFiles > currentImageLimit) {
                    const allowedFiles = validFiles.slice(0, currentImageLimit - existingImages - selectedFiles.length);
                    allowedFiles.forEach(file => selectedFiles.push(file));
                    $('#image-limit-warning').show();
                    $('#image-limit-message').text(`Only the first ${currentImageLimit} images will be uploaded.`);
                    $('#images').addClass('is-invalid');
                    setTimeout(() => {
                        $('#image-limit-warning').hide();
                        $('#images').removeClass('is-invalid');
                    }, 3000);
                } else {
                    validFiles.forEach(file => selectedFiles.push(file));
                }
                $('#image-success-message').show();

                setTimeout(() => {
                    $('#image-success-message').hide();
                }, 3000);
            } else {
                $('#image-success-message').hide();
            }

            updateImagePreview();
            updateImageCount();
            updateFileInput();
            $('#images').val('');
        }

        function removeNewImage(index) {
            if (!confirm('Are you sure you want to remove this image?')) return;
            selectedFiles.splice(index, 1);
            updateFileInput();
            updateImagePreview();
            updateImageCount();
            $('#image-success-message').hide();
        }

        function updateFileInput() {
            const dataTransfer = new DataTransfer();
            selectedFiles.forEach(file => dataTransfer.items.add(file));
            $('#images')[0].files = dataTransfer.files;
        }

        function deleteImage(imageId) {
            if (!confirm('Are you sure you want to delete this image?')) return;
            const imageDiv = $(`#image-${imageId}`);
            const deleteInput = $(`#delete-image-${imageId}`);
            imageDiv.hide();
            deleteInput.val(imageId).prop('disabled', false);
            updateImageCount();
            $('#image-success-message').hide();
        }

        function syncFileInput() {
            if (selectedFiles.length > 0) {
                const dataTransfer = new DataTransfer();
                selectedFiles.forEach(file => dataTransfer.items.add(file));
                $('#images')[0].files = dataTransfer.files;
                console.log('File input synchronized with', selectedFiles.length, 'files');
                return true;
            }
            return false;
        }

        function syncFileInputBeforeSubmit() {
            if (selectedFiles.length > 0) {
                syncFileInput();
                console.log('Form onsubmit - File input synchronized');
            }
            return true;
        }

        function updateProperty() {
            const existingImages = $('#existingImagePreviewContainer .image-preview:not(:hidden)').length;
            const totalImages = existingImages + selectedFiles.length;
            if (totalImages > currentImageLimit) {
                alert(
                    `You can only have up to ${currentImageLimit} images total. Please remove ${totalImages - currentImageLimit} image(s) before submitting.`);
                return;
            }

            const form = $('#propertyForm')[0];
            const formData = new FormData(form);
            const brokerageFeeInput = document.getElementById('brokerage_fee');
            const selectedBrokerageType = document.querySelector('input[name="brokerage_type"]:checked');
            if (brokerageFeeInput && selectedBrokerageType && selectedBrokerageType.value === 'percentage') {
                const cleanBrokerageFee = brokerageFeeInput.value.replace(/[^\d]/g, '');
                formData.set('brokerage_fee', cleanBrokerageFee);
            } else if (brokerageFeeInput && selectedBrokerageType && selectedBrokerageType.value === 'fixed') {
                const cleanBrokerageFee = brokerageFeeInput.value.replace(/[^\d]/g, '');
                formData.set('brokerage_fee', cleanBrokerageFee);
            }

            let cleanPrice = cleanPriceInput();
            formData.set('price', cleanPrice);
            $('#customFieldsContainer').find('input, select, textarea').each(function() {
                if (this.name && !formData.has(this.name)) {
                    formData.append(this.name, this.value);
                }
            });
            if (selectedFiles.length > 0) {
                syncFileInput();
                formData.delete('images[]');
                selectedFiles.forEach((file, index) => {
                    formData.append('images[]', file);
                });

                console.log('Added', selectedFiles.length, 'images to FormData');
            }
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            $('#submitBtn').prop('disabled', true).text('Updating...');
            $.ajax({
                url: $('#propertyForm').attr('action'),
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data) {
                    if (data.success) {
                        alert('Property updated successfully!');
                        window.location.href = '/customer/dashboard/section/properties';
                    } else {
                        showErrors(data.errors);
                    }
                },
                error: function(xhr) {
                    $('#submitBtn').prop('disabled', false).text('Update');
                    if (xhr.status === 422) {
                        console.error('Validation errors:', xhr.responseJSON.errors);
                        showErrors(xhr.responseJSON.errors);
                    } else {
                        alert('An unexpected error occurred. Check console for details.');
                        console.error('Error:', xhr);
                    }
                }
            });
        }
        document.addEventListener('DOMContentLoaded', function() {
            const permalinkInput = document.getElementById('permalink');
            const previewSpan = document.getElementById('permalink-preview');

            permalinkInput.addEventListener('input', function() {
                previewSpan.textContent = this.value;
            });
        });
        $(document).ready(function() {
            $('#permalink').on('input', function() {
                let text = $(this).val();
                text = text.replace(/\s+/g, '-'); // Replace all spaces with dashes
                $(this).val(text);
            });
        });

        function toggleVideoSection() {
            const selected = document.querySelector('input[name="owner_type"]:checked');
            const section = document.getElementById('video-section');

            console.log('toggleVideoSection called');
            console.log('Selected owner type:', selected ? selected.value : 'none');
            console.log('Video section element:', section);

            if (!section) {
                console.log('Video section not found!');
                return;
            }

            if (selected && (selected.value === 'Owner' || selected.value === 'Builder')) {
                console.log('Showing video section');
                section.style.display = 'block';
                section.style.setProperty('display', 'block', 'important');
            } else {
                console.log('Hiding video section');
                section.style.display = 'none';
                section.style.setProperty('display', 'none', 'important');
            }
        }

        function testVideoSection() {
            const selected = document.querySelector('input[name="owner_type"]:checked');
            const section = document.getElementById('video-section');
            const debugSpan = document.getElementById('video-section-debug');
            const allOwnerTypeRadios = document.querySelectorAll('input[name="owner_type"]');
            let radioStatus = 'Radio buttons: ';
            allOwnerTypeRadios.forEach((radio, index) => {
                radioStatus +=
                    `${radio.value}(${radio.checked ? 'checked' : 'unchecked'})${index < allOwnerTypeRadios.length - 1 ? ', ' : ''}`;
            });

            let debugInfo = `Owner Type: ${selected ? selected.value : 'none'}`;
            debugInfo += ` | Section Found: ${section ? 'Yes' : 'No'}`;
            if (section) {
                debugInfo += ` | Current Display: ${section.style.display}`;
                debugInfo += ` | Computed Display: ${window.getComputedStyle(section).display}`;
                debugInfo += ` | Inline Style: ${section.getAttribute('style')}`;
            }
            debugInfo += ` | ${radioStatus}`;

            if (debugSpan) {
                debugSpan.textContent = debugInfo;
            }

            if (section) {
                section.removeAttribute('style');
                section.style.display = 'block';
                section.style.setProperty('display', 'block', 'important');
                console.log('Forced video section to show and removed inline style');
            }
        }

        function forceShowVideoSection() {
            const section = document.getElementById('video-section');
            if (section) {
                section.removeAttribute('style');
                section.style.display = 'block';
                section.style.setProperty('display', 'block', 'important');
                section.style.visibility = 'visible';
                section.style.opacity = '1';

                const debugSpan = document.getElementById('video-section-debug');
                if (debugSpan) {
                    debugSpan.textContent = 'Video section forced to show!';
                }
            } else {
                console.log('Video section not found for force show');
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            const videoSection = document.getElementById('video-section');
            if (videoSection) {
                videoSection.removeAttribute('style');
                console.log('Removed inline style from video section');
            }

            toggleVideoSection();
            document.querySelectorAll('input[name="owner_type"]').forEach(function(radio) {
                radio.addEventListener('change', toggleVideoSection);
            });

            setTimeout(function() {
                console.log('Delayed toggleVideoSection check');
                toggleVideoSection();
            }, 100);

            if (videoSection) {
                const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                            console.log('Video section style changed:', videoSection.style.display);
                        }
                    });
                });

                observer.observe(videoSection, {
                    attributes: true,
                    attributeFilter: ['style']
                });

                console.log('Video section visibility monitoring started');
            }

            const videoUrlInput = document.getElementById('video_url');
            const thumbnailInput = document.getElementById('video_thumbnail');
            const previewImg = document.getElementById('video_thumbnail_preview');

            function getYouTubeId(url) {
                const regExp =
                    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
                const match = url.match(regExp);
                return match ? match[1] : null;
            }

            if (videoUrlInput) {
                videoUrlInput.addEventListener('input', function() {
                    const videoId = getYouTubeId(this.value);
                    if (videoId) {
                        previewImg.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                        previewImg.style.display = 'block';
                    }
                });
            }
        });

        function deleteVideoThumbnail() {
            if (!confirm('Are you sure you want to delete this video thumbnail?')) return;
            const oldThumbnailContainer = document.getElementById('video-thumbnail-old');
            if (oldThumbnailContainer) {
                oldThumbnailContainer.style.display = 'none';
            }

            const deleteInput = document.getElementById('delete-video-thumbnail');
            if (deleteInput) {
                deleteInput.value = '1';
            }

            const thumbnailInput = document.getElementById('video_thumbnail');
            if (thumbnailInput) {
                thumbnailInput.value = '';
            }

            const previewImg = document.getElementById('video_thumbnail_preview');
            const previewContainer = document.getElementById('video-thumbnail-preview-container');

            if (previewImg) {
                previewImg.src = '';
            }

            if (previewContainer) {
                previewContainer.style.display = 'none';
            }

            const removeBtn = previewContainer?.querySelector('.remove-btn-new');
            if (removeBtn) {
                removeBtn.remove();
            }
        }

        function deleteSeoImage() {
            if (!confirm('Are you sure you want to delete this SEO image?')) return;
            const oldSeoImgContainer = document.getElementById('seo-img-old');
            if (oldSeoImgContainer) {
                oldSeoImgContainer.style.display = 'none';
            }

            const deleteInput = document.getElementById('delete-seo-img');
            if (deleteInput) {
                deleteInput.value = '1';
            }

            const seoImgInput = document.getElementById('seo_img');
            if (seoImgInput) {
                seoImgInput.value = '';
            }

            const previewImg = document.getElementById('seo_img_preview');
            const previewContainer = document.getElementById('seo-img-preview-container');

            if (previewImg) {
                previewImg.src = '';
            }

            if (previewContainer) {
                previewContainer.style.display = 'none';
            }

            const removeBtn = previewContainer?.querySelector('.remove-btn-new');
            if (removeBtn) {
                removeBtn.remove();
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            function togglePermalinkSeoSection() {
                const selected = document.querySelector('input[name="owner_type"]:checked');
                const section = document.getElementById('permalink-seo-section');
                if (!section) return;
                if (selected && (selected.value === 'Owner' || selected.value === 'Builder')) {
                    section.style.display = '';
                } else {
                    section.style.display = 'none';
                }
            }

            togglePermalinkSeoSection();
            document.querySelectorAll('input[name="owner_type"]').forEach(function(radio) {
                radio.addEventListener('change', togglePermalinkSeoSection);
            });
        });

        document.addEventListener("DOMContentLoaded", function() {
            document.querySelectorAll('.customer-menu-toggle').forEach(function(toggle) {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    const submenu = this.nextElementSibling;
                    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                });
            });
        });

        function showAlertOnDisabledOwnerType(event, currentOwnerType) {
            event.preventDefault();
            alert('Owner Type cannot be changed');
        }

        function showAlertOnDisabledPropertyFor(event, currentPropertyFor) {
            event.preventDefault();
            alert('Property For cannot be changed for an existing property.');
            $('input[name="property_for"][value="' + currentPropertyFor + '"]').prop('checked', true);
            $('input[name="property_for"]').next('label').find('.check-icon').css('display', 'none');
            $('input[name="property_for"][value="' + currentPropertyFor + '"]').next('label').find('.check-icon').css(
                'display', 'inline');
        }
        $(document).ready(function() {
            function showAlertOnDisabledOwnerType(event, currentOwnerType) {
                event.preventDefault(); 
                alert('Owner Type cannot be changed for an existing property.');
                $('input[name="owner_type"][value="' + currentOwnerType + '"]').prop('checked', true);
                $('input[name="owner_type"]').next('label').find('.check-icon').css('display', 'none');
                $('input[name="owner_type"][value="' + currentOwnerType + '"]').next('label').find('.check-icon')
                    .css('display', 'inline');
            }

            $('input[name="owner_type"]:checked').each(function() {
                $(this).next('label').find('.check-icon').css('display', 'inline');
            });

            $('input[name="owner_type"]').on('change', function() {
                $('input[name="owner_type"]').next('label').find('.check-icon').css('display', 'none');
                if ($(this).is(':checked')) {
                    $(this).next('label').find('.check-icon').css('display', 'inline');
                }
            });

            $('input[name="property_for"]:checked').each(function() {
                $(this).next('label').find('.check-icon').css('display', 'inline');
            });

            $('input[name="property_for"]').on('change', function() {
                $('input[name="property_for"]').next('label').find('.check-icon').css('display', 'none');
                if ($(this).is(':checked')) {
                    $(this).next('label').find('.check-icon').css('display', 'inline');
                    const val = $(this).val();
                    const rentLeaseSection = document.getElementById('rent_lease_toggle_section');
                    if (rentLeaseSection) {
                        rentLeaseSection.style.display = (val === 'rent' || val === 'lease') ? 'block' : 'none';
                    }
                    if (val === 'sell') {
                        updateRentLeaseType();
                    }
                }
            });
        });

        $(document).ready(function() {
            updateImageLimit();
            updateImageCount();
            $('input[name="owner_type"]').on('change', function() {
                updateImageLimit();
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            const renew24Hours = document.getElementById('inlineCheckbox1');
            const renew30Days = document.getElementById('inlineCheckbox2');

            if (renew24Hours && renew30Days) {
                renew24Hours.addEventListener('change', function() {
                    if (this.checked) {
                        renew30Days.checked = false;
                    }
                });

                renew30Days.addEventListener('change', function() {
                    if (this.checked) {
                        renew24Hours.checked = false;
                    }
                });
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            function preventMouseWheelOnNumberInputs() {
                const numberInputs = document.querySelectorAll('input[type="number"]');
                numberInputs.forEach(function(input) {
                    input.addEventListener('wheel', function(e) {
                        e.preventDefault();
                        return false;
                    }, {
                        passive: false
                    });

                    input.addEventListener('focus', function() {
                        this.addEventListener('wheel', function(e) {
                            e.preventDefault();
                            return false;
                        }, {
                            passive: false
                        });
                    });
                });
            }

            function filterNumberInputCharacters() {
                const numberInputs = document.querySelectorAll('input[type="number"]');
                numberInputs.forEach(function(input) {
                    input.addEventListener('input', function(e) {
                        let value = this.value;
                        value = value.replace(/[-+e]/g, '');
                        this.value = value;
                    });

                    input.addEventListener('keydown', function(e) {
                        if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                            e.preventDefault();
                            return false;
                        }
                    });
                });
            }

            preventMouseWheelOnNumberInputs();
            filterNumberInputCharacters();
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        let hasNewNumberInputs = false;
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1) {
                                if (node.querySelector && node.querySelector(
                                        'input[type="number"]')) {
                                    hasNewNumberInputs = true;
                                }
                                if (node.matches && node.matches('input[type="number"]')) {
                                    hasNewNumberInputs = true;
                                }
                            }
                        });

                        if (hasNewNumberInputs) {
                            setTimeout(function() {
                                preventMouseWheelOnNumberInputs();
                                filterNumberInputCharacters();
                            }, 100);
                        }
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            const locationInput = document.getElementById('location');
            if (locationInput) {
                locationInput.addEventListener('input', function(e) {
                    let value = this.value;
                    value = value.replace(/[^a-zA-Z\s]/g, '');
                    this.value = value;
                });

                locationInput.addEventListener('keydown', function(e) {
                    if ([8, 9, 27, 13, 32].indexOf(e.keyCode) !== -1 ||
                        (e.keyCode === 65 && e.ctrlKey === true) ||
                        (e.keyCode === 67 && e.ctrlKey === true) ||
                        (e.keyCode === 86 && e.ctrlKey === true) ||
                        (e.keyCode === 88 && e.ctrlKey === true)) {
                        return;
                    }

                    if (!/^[a-zA-Z\s]$/.test(e.key)) {
                        e.preventDefault();
                        return false;
                    }
                });

                locationInput.addEventListener('paste', function(e) {
                    e.preventDefault();
                    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                    const cleanText = pastedText.replace(/[^a-zA-Z\s]/g, '');
                    document.execCommand('insertText', false, cleanText);
                });
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            console.log('SEO Image and Video Thumbnail validation script loaded (edit-property)');

            const seoImageInput = document.getElementById('seo_img');
            const videoThumbnailInput = document.getElementById('video_thumbnail');

            console.log('Input elements found (edit-property):', {
                seoImageInput: seoImageInput,
                videoThumbnailInput: videoThumbnailInput
            });

            function validateImageFile(file, fieldType) {
                console.log('validateImageFile called with (edit-property):', {
                    file: file.name,
                    fieldType
                });

                const maxFileSize = 2 * 1024 * 1024; // 2MB
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];

                const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
                const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
                const isValidSize = file.size <= maxFileSize;

                console.log('Validation details (edit-property):', {
                    fileSize: file.size,
                    fileSizeInMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                    maxFileSize: maxFileSize,
                    maxFileSizeInMB: (maxFileSize / (1024 * 1024)).toFixed(2) + ' MB',
                    fileType: file.type,
                    fileExtension: fileExtension,
                    isValidType: isValidType,
                    isValidSize: isValidSize,
                    sizeComparison: `${file.size} <= ${maxFileSize} = ${file.size <= maxFileSize}`
                });

                return {
                    isValidType,
                    isValidSize,
                    fileExtension
                };
            }

            function showValidationMessage(fieldType, message, type) {
                console.log('showValidationMessage called with (edit-property):', {
                    fieldType,
                    message,
                    type
                });

                let warningElement, messageElement, successElement;

                if (fieldType === 'seo') {
                    warningElement = document.getElementById('seo-file-size-warning');
                    messageElement = document.getElementById('seo-file-size-message');
                    successElement = document.getElementById('seo-image-success-message');
                } else if (fieldType === 'video-thumbnail') {
                    warningElement = document.getElementById('video-thumbnail-file-size-warning');
                    messageElement = document.getElementById('video-thumbnail-file-size-message');
                    successElement = document.getElementById('video-thumbnail-success-message');
                }

                console.log('Elements found (edit-property):', {
                    warningElement: warningElement,
                    messageElement: messageElement,
                    successElement: successElement
                });

                if (warningElement && messageElement && successElement) {
                    warningElement.style.display = 'none';
                    successElement.style.display = 'none';

                    if (type === 'error') {
                        console.log('Showing error message (edit-property):', message);
                        warningElement.style.display = 'block';
                        messageElement.textContent = message;
                        setTimeout(() => {
                            warningElement.style.display = 'none';
                        }, 15000);
                    } else if (type === 'success') {
                        console.log('Showing success message (edit-property)');
                        successElement.style.display = 'block';
                        setTimeout(() => {
                            successElement.style.display = 'none';
                        }, 3000);
                    }
                } else {
                    console.error('Some elements not found for fieldType (edit-property):', fieldType);
                }
            }
            if (seoImageInput) {
                console.log('SEO Image input found, adding event listener (edit-property)');
                seoImageInput.addEventListener('change', function(e) {
                    console.log('SEO Image change event triggered (edit-property)');
                    const file = e.target.files[0];
                    const oldImg = document.getElementById('seo-img-old');
                    const previewImg = document.getElementById('seo_img_preview');
                    const previewContainer = document.getElementById('seo-img-preview-container');

                    if (file) {
                        console.log('File selected (edit-property):', {
                            name: file.name,
                            size: file.size,
                            type: file.type
                        });
                        const validation = validateImageFile(file, 'seo');
                        console.log('Validation result (edit-property):', validation);

                        if (!validation.isValidType) {
                            console.log('File type invalid, showing error (edit-property)');
                            showValidationMessage('seo', 'Only JPEG/PNG images are allowed.', 'error');
                            this.value = '';
                            if (previewImg) {
                                previewImg.src = '';
                            }
                            if (previewContainer) {
                                previewContainer.style.display = 'none';
                            }
                            if (oldImg) {
                                const deleteInput = document.getElementById('delete-seo-img');
                                if (!deleteInput || deleteInput.value !== '1') {
                                    oldImg.style.display = 'block';
                                }
                            }
                        } else if (!validation.isValidSize) {
                            console.log('File size invalid, showing error (edit-property)');
                            showValidationMessage('seo', 'Image greater than 2 mb', 'error');
                            this.value = '';
                            if (previewImg) {
                                previewImg.src = '';
                            }
                            if (previewContainer) {
                                previewContainer.style.display = 'none';
                            }
                            if (oldImg) {
                                const deleteInput = document.getElementById('delete-seo-img');
                                if (!deleteInput || deleteInput.value !== '1') {
                                    oldImg.style.display = 'block';
                                }
                            }
                        } else {
                            console.log('File valid, checking dimensions (edit-property)');
                            const tempImg = new Image();
                            tempImg.onload = function() {
                                const isValidDimensions = this.width === 1000 && this.height === 1000;

                                if (!isValidDimensions) {
                                    console.log('Invalid dimensions, showing error (edit-property):', {
                                        width: this.width,
                                        height: this.height
                                    });
                                    showValidationMessage('seo',
                                        'Image dimensions must be exactly 1000x1000px. Current dimensions: ' +
                                        this.width + 'x' + this.height + 'px.', 'error');
                                    seoImageInput.value = '';
                                    if (previewImg) {
                                        previewImg.src = '';
                                    }
                                    if (previewContainer) {
                                        previewContainer.style.display = 'none';
                                    }
                                    if (oldImg) {
                                        const deleteInput = document.getElementById('delete-seo-img');
                                        if (!deleteInput || deleteInput.value !== '1') {
                                            oldImg.style.display = 'block';
                                        }
                                    }
                                    return;
                                }

                                showValidationMessage('seo', '', 'success');
                                if (oldImg) {
                                    oldImg.style.display = 'none';
                                }

                                if (previewContainer) {
                                    previewContainer.style.display = 'block';
                                }

                                if (previewImg) {
                                    const reader = new FileReader();
                                    reader.onload = function(e) {
                                        previewImg.src = e.target.result;
                                        let removeBtn = previewContainer.querySelector(
                                            '.remove-btn-new');
                                        if (!removeBtn) {
                                            removeBtn = document.createElement('button');
                                            removeBtn.type = 'button';
                                            removeBtn.className =
                                                'remove-btn-thumbnail remove-btn-new';
                                            removeBtn.innerHTML = '×';
                                            removeBtn.onclick = function() {
                                                const seoImgInput = document.getElementById(
                                                    'seo_img');
                                                if (seoImgInput) {
                                                    seoImgInput.value = '';
                                                }

                                                if (previewContainer) {
                                                    previewContainer.style.display = 'none';
                                                }
                                                if (oldImg) {
                                                    const deleteInput = document.getElementById(
                                                        'delete-seo-img');
                                                    if (!deleteInput || deleteInput.value !==
                                                        '1') {
                                                        oldImg.style.display = 'block';
                                                    }
                                                }

                                                this.remove();
                                            };
                                            previewContainer.appendChild(removeBtn);
                                        }
                                    };
                                    reader.readAsDataURL(file);
                                }
                            };
                            tempImg.src = URL.createObjectURL(file);
                        }
                    } else {
                        if (oldImg) {
                            const deleteInput = document.getElementById('delete-seo-img');
                            if (!deleteInput || deleteInput.value !== '1') {
                                oldImg.style.display = 'block';
                            }
                        }
                        if (previewContainer) {
                            previewContainer.style.display = 'none';
                        }
                    }
                });

                seoImageInput.addEventListener('input', function(e) {
                    if (!this.files || this.files.length === 0) {
                        const oldImg = document.getElementById('seo-img-old');
                        const previewContainer = document.getElementById('seo-img-preview-container');

                        if (oldImg) {
                            const deleteInput = document.getElementById('delete-seo-img');
                            if (!deleteInput || deleteInput.value !== '1') {
                                oldImg.style.display = 'block';
                            }
                        }
                        if (previewContainer) {
                            previewContainer.style.display = 'none';
                        }
                    }
                });
            } else {
                console.error('SEO Image input not found (edit-property)');
            }

            if (videoThumbnailInput) {
                console.log('Video Thumbnail input found, adding event listener (edit-property)');
                videoThumbnailInput.addEventListener('change', function(e) {
                    console.log('Video Thumbnail change event triggered (edit-property)');
                    const file = e.target.files[0];
                    const oldImg = document.getElementById('video-thumbnail-old');
                    const previewImg = document.getElementById('video_thumbnail_preview');
                    if (file) {
                        console.log('Video Thumbnail file selected (edit-property):', {
                            name: file.name,
                            size: file.size,
                            sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                            type: file.type
                        });
                        const validation = validateImageFile(file, 'video-thumbnail');
                        console.log('Video Thumbnail validation result (edit-property):', validation);

                        if (!validation.isValidType) {
                            console.log(
                                'Video Thumbnail file type invalid, showing error and clearing input (edit-property)'
                                );
                            showValidationMessage('video-thumbnail', 'Only JPEG/PNG images are allowed.',
                                'error');
                            this.value = '';
                            if (previewImg) {
                                previewImg.src = '';
                            }
                            const previewContainer = document.getElementById(
                                'video-thumbnail-preview-container');
                            if (previewContainer) {
                                previewContainer.style.display = 'none';
                            }
                            if (oldImg) {
                                const deleteInput = document.getElementById('delete-video-thumbnail');
                                if (!deleteInput || deleteInput.value !== '1') {
                                    oldImg.style.display = 'block';
                                }
                            }
                            console.log(
                                'Video Thumbnail input cleared after type validation failure (edit-property)'
                                );
                        } else if (!validation.isValidSize) {
                            console.log(
                                'Video Thumbnail file size invalid, showing error and clearing input (edit-property)'
                                );
                            showValidationMessage('video-thumbnail', 'Image greater than 2 mb', 'error');
                            this.value = '';
                            if (previewImg) {
                                previewImg.src = '';
                            }
                            const previewContainer = document.getElementById(
                                'video-thumbnail-preview-container');
                            if (previewContainer) {
                                previewContainer.style.display = 'none';
                            }
                            if (oldImg) {
                                const deleteInput = document.getElementById('delete-video-thumbnail');
                                if (!deleteInput || deleteInput.value !== '1') {
                                    oldImg.style.display = 'block';
                                }
                            }
                            console.log(
                                'Video Thumbnail input cleared after size validation failure (edit-property)'
                                );
                        } else {
                            console.log('Video Thumbnail file valid, checking dimensions (edit-property)');

                            console.log('About to check dimensions for video thumbnail (edit-property)');
                            const tempImg = new Image();
                            tempImg.onload = function() {
                                console.log('Image loaded, checking dimensions (edit-property):', {
                                    width: this.width,
                                    height: this.height
                                });
                                const isValidDimensions = this.width === 1280 && this.height === 720;

                                if (!isValidDimensions) {
                                    console.log('Invalid dimensions, showing error (edit-property):', {
                                        width: this.width,
                                        height: this.height
                                    });
                                    showValidationMessage('video-thumbnail',
                                        'Image dimensions must be exactly 1280x720px. Current dimensions: ' +
                                        this.width + 'x' + this.height + 'px.', 'error');
                                    videoThumbnailInput.value = '';  
                                    if (previewImg) {
                                        previewImg.src = '';
                                    }
                                    const previewContainer = document.getElementById(
                                        'video-thumbnail-preview-container');
                                    if (previewContainer) {
                                        previewContainer.style.display = 'none';
                                    }
                                    if (oldImg) {
                                        const deleteInput = document.getElementById(
                                            'delete-video-thumbnail');
                                        if (!deleteInput || deleteInput.value !== '1') {
                                            oldImg.style.display = 'block';
                                        }
                                    }
                                    return;
                                }

                                console.log('Dimensions valid, showing success (edit-property)');
                                showValidationMessage('video-thumbnail', '', 'success');

                                if (oldImg) {
                                    oldImg.style.display = 'none';
                                }

                                const previewContainer = document.getElementById(
                                    'video-thumbnail-preview-container');
                                if (previewContainer) {
                                    previewContainer.style.display = 'block';
                                }

                                if (previewImg) {
                                    const reader = new FileReader();
                                    reader.onload = function(e) {
                                        previewImg.src = e.target.result;
                                        let removeBtn = previewContainer.querySelector(
                                            '.remove-btn-new');
                                        if (!removeBtn) {
                                            removeBtn = document.createElement('button');
                                            removeBtn.type = 'button';
                                            removeBtn.className =
                                                'remove-btn-thumbnail remove-btn-new';
                                            removeBtn.innerHTML = '×';
                                            removeBtn.onclick = function() {
                                                const thumbnailInput = document.getElementById(
                                                    'video_thumbnail');
                                                if (thumbnailInput) {
                                                    thumbnailInput.value = '';
                                                }

                                                if (previewContainer) {
                                                    previewContainer.style.display = 'none';
                                                }
                                                if (oldImg) {
                                                    const deleteInput = document.getElementById(
                                                        'delete-video-thumbnail');
                                                    if (!deleteInput || deleteInput.value !==
                                                        '1') {
                                                        oldImg.style.display = 'block';
                                                    }
                                                }

                                                this.remove();
                                            };
                                            previewContainer.appendChild(removeBtn);
                                        }
                                    };
                                    reader.readAsDataURL(file);
                                }
                            };
                            tempImg.src = URL.createObjectURL(file);
                        }
                    } else {
                        if (oldImg) {
                            const deleteInput = document.getElementById('delete-video-thumbnail');
                            if (!deleteInput || deleteInput.value !== '1') {
                                oldImg.style.display = 'block';
                            }
                        }
                        if (previewImg) {
                            previewImg.style.display = 'none';
                        }
                    }
                });

                videoThumbnailInput.addEventListener('input', function(e) {
                    if (!this.files || this.files.length === 0) {
                        const oldImg = document.getElementById('video-thumbnail-old');
                        const previewContainer = document.getElementById(
                            'video-thumbnail-preview-container');

                        if (oldImg) {
                            const deleteInput = document.getElementById('delete-video-thumbnail');
                            if (!deleteInput || deleteInput.value !== '1') {
                                oldImg.style.display = 'block';
                            }
                        }
                        if (previewContainer) {
                            previewContainer.style.display = 'none';
                        }
                    }
                });
            } else {
                console.error('Video Thumbnail input not found (edit-property)');
            }

            const seoSuccessMessage = document.getElementById('seo-image-success-message');
            const videoThumbnailSuccessMessage = document.getElementById('video-thumbnail-success-message');
            if (seoSuccessMessage) seoSuccessMessage.style.display = 'none';
            if (videoThumbnailSuccessMessage) videoThumbnailSuccessMessage.style.display = 'none';
            const form = document.getElementById('propertyForm');
            if (form) {
                form.addEventListener('submit', function() {
                    if (seoSuccessMessage) seoSuccessMessage.style.display = 'none';
                    if (videoThumbnailSuccessMessage) videoThumbnailSuccessMessage.style.display = 'none';
                });
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            console.log('existingFieldValues:', @json($existingFieldValues));
            console.log('Property:', @json($property));
            console.log('Custom Fields:', @json($customFields));
            console.log('Categories:', @json($re_categorie));
        });

        function showError(inputElement, message) {
            const name = inputElement.name;
            const safeId = name.replace(/\[|\]/g, '_').replace(/_+/g, '_').replace(/_$/, '');
            const errorContainerId = `${safeId}_error`;

            if (name === 'facility_ids[]' || name === 'facility_values[]') {
                const row = inputElement.closest('.facility-row');
                if (row) {
                    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
                    const uniqueErrorContainerId = `${safeId}_row_${rowIndex}_error`;

                    let errorContainer = document.getElementById(uniqueErrorContainerId);
                    if (!errorContainer) {
                        errorContainer = document.createElement('div');
                        errorContainer.id = uniqueErrorContainerId;
                        errorContainer.className = 'text-danger dynamic-error mt-1';
                        inputElement.parentNode.insertBefore(errorContainer, inputElement.nextSibling);
                    }

                    errorContainer.textContent = message;
                    errorContainer.style.display = 'block';
                    inputElement.classList.add('is-invalid');
                    return;
                }
            }
            let errorContainer = document.getElementById(errorContainerId);
            if (!errorContainer) {
                errorContainer = document.createElement('div');
                errorContainer.id = errorContainerId;
                errorContainer.className = 'text-danger dynamic-error mt-1';
                if (inputElement.type === 'radio') {
                    const fieldset = inputElement.closest('fieldset');
                    if (fieldset) {
                        fieldset.appendChild(errorContainer);
                    } else {
                        inputElement.parentNode.insertBefore(errorContainer, inputElement.nextSibling);
                    }
                } else {
                    inputElement.parentNode.insertBefore(errorContainer, inputElement.nextSibling);
                }
            }

            errorContainer.textContent = message;
            errorContainer.style.display = 'block';
            if (inputElement.type !== 'radio') {
                inputElement.classList.add('is-invalid');
            }
        }

        function clearError(inputElement) {
            const name = inputElement.name;
            const safeId = name.replace(/\[|\]/g, '_').replace(/_+/g, '_').replace(/_$/, '');
            const errorContainerId = `${safeId}_error`;
            if (name === 'facility_ids[]' || name === 'facility_values[]') {
                const row = inputElement.closest('.facility-row');
                if (row) {
                    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
                    const uniqueErrorContainerId = `${safeId}_row_${rowIndex}_error`;
                    let errorContainer = document.getElementById(uniqueErrorContainerId);
                    if (errorContainer) {
                        errorContainer.textContent = '';
                        errorContainer.style.display = 'none';
                    }
                    inputElement.classList.remove('is-invalid');
                    return;
                }
            }

            let errorContainer = document.getElementById(errorContainerId);
            if (errorContainer) {
                errorContainer.textContent = '';
                errorContainer.style.display = 'none';
            }

            if (inputElement.type !== 'radio') {
                inputElement.classList.remove('is-invalid');
            }
        }

        function validateFacilityField(facilitySelect, facilityValue) {
            clearError(facilitySelect);
            clearError(facilityValue);
            if (facilitySelect.value && facilitySelect.value !== "" && facilitySelect.value !== "Select Facilities") {
                if (!facilityValue.value || facilityValue.value.trim() === "") {
                    showError(facilityValue, "Please enter a distance value for the selected facility");
                    return false;
                }
            }

            if (facilityValue.value && facilityValue.value.trim() !== "") {
                if (!facilitySelect.value || facilitySelect.value === "" || facilitySelect.value === "Select Facilities") {
                    showError(facilitySelect, "Please select a facility type");
                    return false;
                }
            }

            return true;
        }

        document.addEventListener('DOMContentLoaded', function() {

            document.querySelectorAll('.facility-row').forEach(function(row) {
                const facilitySelect = row.querySelector('select[name="facility_ids[]"]');
                const facilityValue = row.querySelector('input[name="facility_values[]"]');

                if (facilitySelect && facilityValue) {
                    facilitySelect.addEventListener('change', function() {
                        validateFacilityField(this, facilityValue);
                    });

                    facilityValue.addEventListener('input', function() {
                        validateFacilityField(facilitySelect, this);
                    });
                }
            });

            const facilitiesContainer = document.getElementById('facilitiesContainer');
            if (facilitiesContainer) {
                facilitiesContainer.addEventListener('change', function(e) {
                    if (e.target && e.target.name === 'facility_ids[]') {
                        const row = e.target.closest('.facility-row');
                        const facilityValue = row.querySelector('input[name="facility_values[]"]');
                        if (facilityValue) {
                            validateFacilityField(e.target, facilityValue);
                        }
                    }
                });

                facilitiesContainer.addEventListener('input', function(e) {
                    if (e.target && e.target.name === 'facility_values[]') {
                        const row = e.target.closest('.facility-row');
                        const facilitySelect = row.querySelector('select[name="facility_ids[]"]');
                        if (facilitySelect) {
                            validateFacilityField(facilitySelect, e.target);
                        }
                    }
                });
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const isViewMode = urlParams.get('mode') === 'view';
            const isPending = '{{ $property->moderation_status ?? '' }}' === 'pending';

            if (isViewMode || isPending) {
                const updateButton = document.getElementById('submitBtn');
                if (updateButton) {
                    updateButton.disabled = true;
                }
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            const path = window.location.pathname;
            const id = path.split('/').pop();
            const input = document.getElementById('permalink');
            const preview = document.getElementById('full-preview');
            const baseSpan = document.getElementById('base-url');
            const baseUrl = baseSpan.innerText.trim();

            function updatePermalink(value) {
                value = value.trim().replace(/^\/+/, '');
                if (!value.startsWith(id + '/')) {
                    value = id + '/' + value;
                }

                input.value = value;
                preview.textContent = baseUrl + value;
            }

            if (input.value.trim()) {
                updatePermalink(input.value);
            }

            input.addEventListener('input', function() {
                updatePermalink(this.value);
            });
        });
    </script>
@endsection
