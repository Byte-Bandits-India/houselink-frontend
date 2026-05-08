@extends('website.layouts.app')
@section('head')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@yaireo/tagify/dist/tagify.css">
    <style>
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

        .radio-group {
            margin-right: 15px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .form-check-input {
            position: absolute;
            opacity: 0;
        }

        .form-check-label {
            cursor: pointer;
            border: 1px solid #a3daff;
            padding: 8px 16px;

            border-radius: 20px;
            transition: all 0.3s ease;
        }

        .form-check-input:checked+.form-check-label {
            background-color: #163d75;
            color: #fff;
            border-color: #163d75;
        }

        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        input[type="number"] {
            -moz-appearance: textfield;
        }

        input[type="number"]:focus {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

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

        .is-invalid {
            border-color: #d63939 !important;
        }

        .text-danger {
            font-size: 0.875em;
        }

        .form-control {
            border: 1px solid #a3a3a3 !important;
        }

        .select.form-control {
            outline: 1px solid #a3a3a3 !important;
            color: #000000 !important;
        }

        .form-group {
            margin-bottom: 15px;
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

        .page-header {
            background: url("{{ asset('assets/images/footer/dashboard_image.png') }}");
        }

        .card {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
        }

        @media (max-width: 768px) {
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

        .btn-outline-primary {
            --bs-btn-color: #163d75;
            --bs-btn-border-color: #163d75a1;
            --bs-btn-hover-color: #fff;
            --bs-btn-hover-bg: #163d75;
            --bs-btn-hover-border-color: #163d75;
            --bs-btn-active-color: #fff;
            --bs-btn-active-bg: #163d75;
            --bs-btn-active-border-color: #163d75;
        }

        .custom-radio-card {
            position: relative;
            padding-left: 30px;
            cursor: pointer;
            user-select: none;
        }

        .custom-radio-card input[type="radio"]:checked+label+.tick-icon {
            display: inline;
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

        input[type="number"] {
            -webkit-appearance: none;
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

        input[type="number"] {
            -webkit-appearance: none;
            -moz-appearance: textfield;
            appearance: textfield;
        }
    </style>

    <div class="page-header parallaxie">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <!-- Page Header Box Start -->
                    <div class="page-header-box">
                        <h1 class="text-anime-style-2" data-cursor="-opaque">Customer Dashboard</h1>
                        <nav class="wow fadeInUp">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="{{ route('index') }}">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Add-Property</li>
                            </ol>
                        </nav>
                    </div>
                    <!-- Page Header Box End -->
                </div>
            </div>
        </div>
    </div>

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
                            @elseif (session('error'))
                                <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1055;">
                                    <div class="toast align-items-center text-bg-light border-0 show" role="alert">
                                        <div class="d-flex">
                                            <div class="toast-body">
                                                {{ session('error') }}
                                            </div>
                                            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"
                                                aria-label="Close"></button>
                                        </div>
                                    </div>
                                </div>
                            @endif
                            <div class="step-sidebar p-1">
                                <ul class="stepper">
                                    <li class="active">
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
                            <div class="card">
                                <div class="card-body">
                                    <div class="row">
                                        <form id="propertyForm" action="{{ route('property.store') }}" method="POST"
                                            enctype="multipart/form-data" novalidate>
                                            @csrf
                                            <div class="form-step" id="step-1">                                                
                                                <h5>Step 1: Basic Details</h5>
                                                <input type="hidden" id="credit_owner" value="{{ $ownerPackage && $ownerPackage->no_of_credit > 0 ? 1 : 0 }}">
                                                <input type="hidden" id="credit_builder" value="{{ $builderPackage && $builderPackage->no_of_credit > 0 ? 1 : 0 }}">
                                                <input type="hidden" id="credit_consultant" value="{{ $consultantPackage && $consultantPackage->no_of_credit > 0 ? 1 : 0 }}">

                                                <h6 class="mt-4">Property For <span class="text-danger">*</span></h6>
                                                <div class="form-group mt-2 d-flex flex-wrap">
                                                    <div class="form-check form-check-inline custom-radio-card">
                                                        <input type="radio" class="form-check-input" name="property_for" id="for_sell" value="sell" {{ old('property_for', 'sell') == 'sell' ? 'checked' : '' }}>
                                                        <label class="form-check-label" for="for_sell">Sell</label>
                                                    </div>
                                                    <div class="form-check form-check-inline custom-radio-card">
                                                        <input type="radio" class="form-check-input" name="property_for" id="for_rentlease" value="rent_lease" {{ old('property_for') == 'rent_lease' ? 'checked' : '' }}>
                                                        <label class="form-check-label" for="for_rentlease">Rent / Lease</label>
                                                    </div>
                                                </div>

                                                <h6 class="mt-4">Are you ? <span class="text-danger">*</span></h6>
                                                <div id="package_warning_msg" class="alert alert-warning mt-2 mb-2" style="display: none; background-color: #fff3cd; border-color: #ffeeba; color: #856404;">
                                                    <strong>Note:</strong> You do not have an active package to post a <strong>Sell</strong> property.
                                                </div>
                                                <div id="owner_options_for_sell">
                                                    <div class="form-group mt-2 d-flex flex-wrap">
                                                        @if ($hasOwnerCredits)
                                                            <div class="form-check form-check-inline custom-radio-card">
                                                                <input type="radio" class="form-check-input" name="owner_type" id="owner_owner" value="Owner">
                                                                <label class="form-check-label" for="owner_owner">Owner</label>
                                                            </div>
                                                        @endif
                                                        @if ($hasBuilderCredits)
                                                            <div class="form-check form-check-inline custom-radio-card">
                                                                <input type="radio" class="form-check-input" name="owner_type" id="owner_builder" value="Builder">
                                                                <label class="form-check-label" for="owner_builder">Builder</label>
                                                            </div>
                                                        @endif
                                                        @if ($hasConsultantCredits)
                                                            <div class="form-check form-check-inline custom-radio-card">
                                                                <input type="radio" class="form-check-input" name="owner_type" id="owner_consultant" value="Consultant">
                                                                <label class="form-check-label" for="owner_consultant">Consultant</label>
                                                            </div>
                                                        @endif
                                                    </div>
                                                </div>
                                                <div id="owner_options_for_rent" style="display: none;">
                                                    <div class="form-group mt-2 d-flex flex-wrap">
                                                        <div class="form-check form-check-inline custom-radio-card">
                                                            <input type="radio" class="form-check-input" name="owner_type" id="owner_owner_rent" value="Owner">
                                                            <label class="form-check-label" for="owner_owner_rent">Owner</label>
                                                        </div>
                                                        <div class="form-check form-check-inline custom-radio-card">
                                                            <input type="radio" class="form-check-input" name="owner_type" id="owner_consultant_rent" value="Consultant">
                                                            <label class="form-check-label" for="owner_consultant_rent">Consultant</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id="owner_type_error" class="text-danger dynamic-error">
                                                </div>

                                                <h6 class="mt-4 mb-2">And its a ... <span class="text-danger">*</span>
                                                </h6>
                                                <div class="form-group">
                                                    <div class="form-check form-check-inline">
                                                        <input type="radio" class="form-check-input" name="property_main_type" id="type_residential" checked value="residential" onchange="step1_updatePropertyTypeButtons()">
                                                        <label class="form-check-label" for="type_residential">Residential</label>
                                                    </div>
                                                    <div class="form-check form-check-inline">
                                                        <input type="radio" class="form-check-input" name="property_main_type" id="type_commercial" value="commercial" onchange="step1_updatePropertyTypeButtons()">
                                                        <label class="form-check-label" for="type_commercial">Commercial</label>
                                                    </div>
                                                </div>

                                                <h6 class="mt-3 mb-2">Property Type <span class="text-danger">*</span></h6>
                                                <div class="form-group mb-3">
                                                    <div class="d-flex flex-wrap" id="property-type-wrapper">
                                                        @if ($re_categorie->contains('name', 'Apartments'))
                                                            <button type="button" class="btn btn-outline-primary me-2 mb-2 res-type" data-type="apartment">Apartment</button>
                                                        @endif
                                                        @if ($re_categorie->contains('name', 'Villas'))
                                                            <button type="button" class="btn btn-outline-primary me-2 mb-2 res-type" data-type="villa">Villa</button>
                                                        @endif
                                                        @if ($re_categorie->contains('name', 'Individual House'))
                                                            <button type="button" class="btn btn-outline-primary me-2 mb-2 res-type" data-type="individual_house">Individual House</button>
                                                        @endif
                                                        @if ($re_categorie->contains('name', 'Plots'))
                                                            <button type="button" class="btn btn-outline-primary me-2 mb-2 d-none" id="btn-plot" data-type="plot">Plots</button>
                                                        @endif
                                                        @if ($re_categorie->contains('name', 'Land'))
                                                            <button type="button" class="btn btn-outline-primary me-2 mb-2 com-type d-none" id="btn-land" data-type="land">Land</button>
                                                        @endif
                                                        @if ($re_categorie->contains('name', 'Shop'))
                                                            <button type="button" class="btn btn-outline-primary me-2 mb-2 com-type d-none" data-type="shop">Shop</button>
                                                        @endif
                                                        @if ($re_categorie->contains('name', 'Building'))
                                                            <button type="button" class="btn btn-outline-primary me-2 mb-2 com-type d-none" data-type="building">Building</button>
                                                        @endif
                                                        @if ($re_categorie->contains('name', 'Godown'))
                                                            <button type="button" class="btn btn-outline-primary me-2 mb-2 com-type d-none" data-type="godown">Godown</button>
                                                        @endif
                                                        @if ($re_categorie->contains('name', 'Warehouse'))
                                                            <button type="button" class="btn btn-outline-primary me-2 mb-2 com-type d-none" data-type="warehouse">Warehouse</button>
                                                        @endif
                                                        @if ($re_categorie->contains('name', 'Office Space'))
                                                            <button type="button" class="btn btn-outline-primary me-2 mb-2 com-type d-none" data-type="office_space">Office Space</button>
                                                        @endif
                                                    </div>
                                                    <input type="hidden" name="property_subtype" id="property_subtype">
                                                    <input type="hidden" name="category_id" id="category_id">
                                                    <span class="text-danger" id="property_subtype_error"></span>
                                                </div>
                                                <div id="step1-dynamic-fields" class="mt-4">
                                                    <div id="field-group-plot" class="dynamic-group d-none border p-3 rounded bg-light">
                                                        <h6 class="mb-3" id="plot-details-title">Land Details</h6>
                                                        <div class="row">
                                                            <div class="col-md-6 mb-3">
                                                                <label class="form-label" id="label_plot_area">Land Area <span class="text-danger">*</span></label>
                                                                <input type="number" class="form-control" name="plot_area" id="input_plot_area">
                                                            </div>
                                                            <div class="col-md-6 mb-3">
                                                                <label class="form-label">Unit <span class="text-danger">*</span></label>
                                                                <select class="form-select" name="plot_unit">
                                                                    <option value="">Select Unit</option>
                                                                    <option value="1">Sq. Ft</option>
                                                                    <option value="2">Square Inches</option>
                                                                    <option value="3">Acres</option>
                                                                    <option value="4">Cents</option>
                                                                    <option value="5">Square Meters</option>
                                                                    <option value="6">Square Yards</option>
                                                                    <option value="7">Hectares</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div class="row" id="plot-additional-details">
                                                            <div class="col-12">
                                                                <label class="form-label"><strong>Additional Details</strong></label>
                                                            </div>
                                                            <div class="col-md-6 mb-3">
                                                                <label class="form-label">Length</label>
                                                                <input type="number" class="form-control" name="plot_length">
                                                            </div>
                                                            <div class="col-md-6 mb-3">
                                                                <label class="form-label">Breadth</label>
                                                                <input type="number" class="form-control" name="plot_breadth">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="field-group-structure" class="dynamic-group d-none border p-3 rounded bg-light">
                                                        <h6 class="mb-3">Area Details</h6>
                                                        <div class="row">
                                                            <div class="col-md-6 mb-3">
                                                                <label class="form-label">Built-Up Area <span class="text-danger">*</span></label>
                                                                <input type="number" class="form-control" name="super_builtup_area" id="input_builtup_area">
                                                            </div>
                                                            <div class="col-md-6 mb-3">
                                                                <label class="form-label">Unit <span class="text-danger">*</span></label>
                                                                <select class="form-select" name="builtup_unit">
                                                                    <option value="">Select Unit</option>
                                                                    <option value="1">Sq. Ft</option>
                                                                    <option value="2">Square Inches</option>
                                                                    <option value="3">Acres</option>
                                                                    <option value="4">Cents</option>
                                                                    <option value="5">Square Meters</option>
                                                                    <option value="6">Square Yards</option>
                                                                    <option value="7">Hectares</option>
                                                                </select>
                                                            </div>
                                                            <div class="col-md-6 mb-3" id="col_carpet_area">
                                                                <label class="form-label">Carpet Area</label>
                                                                <input type="number" class="form-control" name="carpet_area">
                                                            </div>
                                                            <div class="col-md-6 mb-3" id="col_carpet_unit">
                                                                <label class="form-label">Unit</label>
                                                                <select class="form-select" name="carpet_unit">
                                                                    <option value="">Select Unit</option>
                                                                    <option value="1">Sq. Ft</option>
                                                                    <option value="2">Square Inches</option>
                                                                    <option value="3">Acres</option>
                                                                    <option value="4">Cents</option>
                                                                    <option value="5">Square Meters</option>
                                                                    <option value="6">Square Yards</option>
                                                                    <option value="7">Hectares</option>
                                                                </select>
                                                            </div>
                                                            <div class="col-md-6 mb-3 d-none" id="storage_area_wrapper">
                                                                <label class="form-label"> Storage Area <span class="text-danger">*</span></label>
                                                                <input type="number" class="form-control" name="storage_area" id="input_storage_area">
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div id="field-group-apartment" class="dynamic-group d-none border p-3 rounded bg-light mt-3">
                                                        <h6 class="mb-3">Floor Details</h6>
                                                        <div class="row">
                                                            <div class="col-md-6 mb-3">
                                                                <label class="form-label">Total Floors <span class="text-danger" id="total_floors_asterisk" style="display:none">*</span></label>
                                                                <input type="number" class="form-control" name="total_floors" id="input_total_floors">
                                                            </div>
                                                            <div class="col-md-6 mb-3">
                                                                <label class="form-label">Property On Floor <span class="text-danger" id="property_on_floor_asterisk" style="display:none">*</span></label>
                                                                <input type="number" class="form-control" name="property_on_floor" id="input_property_on_floor">
                                                            </div>
                                                            <div class="row d-none" id="uds_wrapper">
                                                                <div class="col-md-6 mb-3">
                                                                    <label class="form-label">UDS Area</label>
                                                                    <input type="number" class="form-control" name="uds_area" id="input_uds_area" placeholder="Undivided Share Area">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <script>
                                                            function toggleUDSField() {
                                                                const subtype = document.getElementById('property_subtype')?.value;

                                                                const propertyForRadio = document.querySelector('input[name="property_for"]:checked');
                                                                const propertyFor = propertyForRadio ? propertyForRadio.value : null;

                                                                const udsWrapper = document.getElementById('uds_wrapper');
                                                                const udsInput = document.getElementById('input_uds_area');

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
                                                        </script>
                                                    </div>
                                                </div>
                                                <div class="row" id="customFieldsContainer">
                                                </div>
                                            </div>

                                            <script>
                                                document.addEventListener('DOMContentLoaded', function() {
                                                    const unitNames = ['plot_unit', 'builtup_unit', 'carpet_unit'];

                                                    function consolidateUnits() {
                                                        let firstVisibleContainer = null;
                                                        let masterSelect = null;
                                                        const subtype = document.getElementById('property_subtype')?.value;
                                                        const isVillaOrHouse = ['villa', 'individual_house'].includes(subtype);

                                                        unitNames.forEach(name => {
                                                            const select = document.querySelector(`select[name="${name}"]`);
                                                            if (!select) return;

                                                            const container = select.closest('.col-md-6');
                                                            const group = select.closest('.dynamic-group');
                                                            const isVisible = group && !group.classList.contains('d-none');

                                                            // If the parent group is hidden, hide the unit container too
                                                            if (!isVisible) {
                                                                container.style.display = 'none';
                                                                return;
                                                            }

                                                            // Parent group is visible — decide whether to show or hide this unit
                                                            if (!firstVisibleContainer) {
                                                                container.style.display = 'block';
                                                                firstVisibleContainer = container;
                                                                masterSelect = select;
                                                            } else if (isVillaOrHouse && name === 'builtup_unit') {
                                                                container.style.display = 'block';
                                                            } else {
                                                                container.style.display = 'none';
                                                            }
                                                        });
                                                    }

                                                    // Attach the sync-on-change listener once at init, not inside consolidateUnits
                                                    unitNames.forEach(name => {
                                                        const select = document.querySelector(`select[name="${name}"]`);
                                                        if (!select) return;
                                                        select.addEventListener('change', function() {
                                                            const val = this.value;
                                                            const subtype = document.getElementById('property_subtype')?.value;
                                                            const isVillaOrHouse = ['villa', 'individual_house'].includes(subtype);
                                                            unitNames.forEach(otherName => {
                                                                const other = document.querySelector(`select[name="${otherName}"]`);
                                                                if (!other || other === this) return;
                                                                if (isVillaOrHouse && (otherName === 'plot_unit' || otherName === 'builtup_unit')) return;
                                                                other.value = val;
                                                            });
                                                        });
                                                    });

                                                    consolidateUnits();

                                                    const typeWrapper = document.getElementById('property-type-wrapper');
                                                    if (typeWrapper) {
                                                        typeWrapper.addEventListener('click', function(e) {
                                                            if (e.target.tagName === 'BUTTON') {
                                                                // rAF ensures this runs after all synchronous click handlers
                                                                // (including handleSubtypeChange) have updated the DOM,
                                                                // but before the browser paints — no flicker, correct order.
                                                                requestAnimationFrame(consolidateUnits);
                                                            }
                                                        });
                                                    }

                                                    document.querySelectorAll('input[name="property_main_type"]').forEach(radio => {
                                                        radio.addEventListener('change', function() {
                                                            requestAnimationFrame(consolidateUnits);
                                                        });
                                                    });
                                                });
                                            </script>

                                            <div class="form-step d-none" id="step-2">
                                                <h5 class="mb-4">Step 2: Property Profile</h5>
                                                <div class="form-group mb-3">
                                                    <label for="name">Property Name <span class="text-danger">*</span></label>
                                                    <input type="text" class="form-control" name="name" id="name"
                                                        value="{{ old('name') }}" required>
                                                </div>
                                                <div id="permalink-section" class="mb-3">
                                                    <label for="permalink" class="form-label">Permalink <span
                                                            class="text-danger">*</span></label>
                                                    <div class="input-group">
                                                        <span class="input-group-text"
                                                            style="background: #e9ecef;">https://houselink360.com/properties/</span>
                                                        <input type="text" class="form-control" id="permalink"
                                                            name="permalink" value="{{ old('permalink') }}" required>
                                                    </div>
                                                    <small class="form-text text-muted">
                                                        Preview: https://houselink360.com/properties/<span
                                                            id="permalink-preview"></span>
                                                    </small>
                                                    <div id="permalink-feedback"></div>
                                                </div>
                                                <div class="form-group mb-3">
                                                    <label for="description">Description <span
                                                            class="text-danger">*</span></label>
                                                    <textarea class="form-control" name="description" id="description" rows="5" required>{{ old('description') }}</textarea>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-6 mb-3">
                                                        <label class="form-label">House Type <span
                                                                class="text-danger">*</span>
                                                        </label>
                                                        <select class="form-select" name="house_type">
                                                            <option value="">Select Type</option>
                                                            <option value="1RK">1RK</option>
                                                            <option value="1BHK">1BHK</option>
                                                            <option value="2BHK">2BHK</option>
                                                            <option value="3BHK">3BHK</option>
                                                            <option value="4BHK">4BHK</option>
                                                            <option value="5BHK">5BHK</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-4 d-flex d-flex-wrap mb-3" id="tenant_preference_wrapper" style="display:none!important;">
                                                        <div class="col-md-6 text-md-end text-start">
                                                            <label>Tenant Preference <span style="color:red">*</span></label>
                                                        </div>
                                                        <div class="col-md-10 justify-content-start">
                                                            <div id="residential_tenant_prefs">
                                                                @foreach (['Family', 'Bachelor', 'Students', 'Working Professionals', 'Any'] as $label)
                                                                    <div class="form-check">
                                                                        <input type="checkbox" class=" tenant-check"
                                                                            name="tenant_preference[]"
                                                                            value="{{ $label }}"
                                                                            id="pref_{{ Str::slug($label) }}">
                                                                        <label for="pref_{{ Str::slug($label) }}">
                                                                            {{ $label }} <span class="tick-icon"
                                                                                style="display:none; color:green;">✓</span>
                                                                        </label>
                                                                    </div>
                                                                @endforeach
                                                            </div>
                                                            <div id="commercial_tenant_prefs" style="display:none;">
                                                                @foreach (['Individual', 'Company', 'Any'] as $label)
                                                                    <div class="form-check">
                                                                        <input type="checkbox" class="tenant-check"
                                                                            name="tenant_preference[]"
                                                                            value="{{ $label }}"
                                                                            id="pref_commercial_{{ Str::slug($label) }}">
                                                                        <label for="pref_commercial_{{ Str::slug($label) }}">
                                                                            {{ $label }} <span class="tick-icon"
                                                                                style="display:none; color:green;">✓</span>
                                                                        </label>
                                                                    </div>
                                                                @endforeach
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4 mb-3">
                                                        <label class="form-label">Construction Age</label>
                                                        <select class="form-select" name="construction_age">
                                                            <option value="">Select Age</option>
                                                            <option value="New Construction">New Construction</option>
                                                            <option value="Less than 1 year">Less than 1 year</option>
                                                            <option value="1-3 years">1-3 years</option>
                                                            <option value="3-5 years">3-5 years</option>
                                                            <option value="5-10 years">5-10 years</option>
                                                            <option value="10+ years">10+ years</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-4 mb-3" id="bedrooms-section">
                                                        <label class="form-label">Bedrooms <span
                                                                class="text-danger">*</span></label>
                                                        <input type="number" class="form-control" name="bedrooms"
                                                            id="bedrooms" min="0">
                                                    </div>
                                                    <div class="col-md-4 mb-3" id="bathrooms-section">
                                                        <label class="form-label">Bathrooms <span
                                                                class="text-danger">*</span></label>
                                                        <input type="number" class="form-control" name="bathrooms"
                                                            id="bathrooms" min="0">
                                                    </div>
                                                </div>                                                
                                                <div class="row">
                                                    <div class="col-md-4 mb-3">
                                                        <label class="form-label">Balcony</label>
                                                        <div class="d-flex gap-3 pt-2">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio" name="balcony"
                                                                    id="balcony_yes" value="Yes">
                                                                <label class="form-check-label" for="balcony_yes">Yes</label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio" name="balcony"
                                                                    id="balcony_no" value="No">
                                                                <label class="form-check-label" for="balcony_no">No</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div id="villa-specific-fields" style="display: none;"
                                                        class="mt-3 border p-3 rounded bg-light">
                                                        <div class="row">
                                                            <div class="col-md-6 mb-3">
                                                                <label class="form-label">Garden / Lawn</label>
                                                                <div class="d-flex gap-3">
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio"
                                                                            name="garden" id="garden_yes" value="Yes">
                                                                        <label class="form-check-label"
                                                                            for="garden_yes">Yes</label>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio"
                                                                            name="garden" id="garden_no" value="No">
                                                                        <label class="form-check-label" for="garden_no">No</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-6 mb-3">
                                                                <label class="form-label">Swimming Pool</label>
                                                                <div class="d-flex gap-3">
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio"
                                                                            name="swimming_pool" id="pool_yes" value="Yes">
                                                                        <label class="form-check-label" for="pool_yes">Yes</label>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio"
                                                                            name="swimming_pool" id="pool_no" value="No">
                                                                        <label class="form-check-label" for="pool_no">No</label>
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

                                                        (function() {
                                                            const hide = (id) => {
                                                                const el = document.getElementById(id);
                                                                if (el) el.style.setProperty('display', 'none', 'important');
                                                            };
                                                            const show = (id) => {
                                                                const el = document.getElementById(id);
                                                                if (el) el.style.setProperty('display', '', 'important');
                                                            };
                                                            function applyLandRules() {
                                                                const subtype = document.getElementById('property_subtype')?.value;
                                                                if (!['plot', 'land', 'land_lease'].includes(subtype)) return;
                                                                [
                                                                    'balcony_wrapper',
                                                                    'bedrooms-section',
                                                                    'bathrooms-section',
                                                                    'villa-specific-fields',
                                                                    'utility_area_wrapper',
                                                                    'loading_unloading_wrapper',
                                                                    'pantry_area_wrapper',
                                                                    'key_specifications_wrapper',
                                                                    'parking',
                                                                    'parking_card',
                                                                    'parking_type_div',
                                                                    'parking_slots_wrapper',
                                                                    'property_suitable_for_wrapper'
                                                                ].forEach(hide);

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

                                                                ['pet_policy', 'parking_availability'].forEach(name => {
                                                                    document.querySelectorAll(`input[name="${name}"]`)
                                                                        .forEach(r => r.closest('.col-md-4')
                                                                            ?.style.setProperty('display', 'none', 'important'));
                                                                });

                                                                show('corner_property_wrapper');
                                                                show('compound_wall_wrapper');

                                                                document.querySelectorAll('input[name="tenant_preference[]"]')
                                                                    .forEach(cb => cb.closest('.col-md-6')?.style.setProperty('display', ''));

                                                                const ownership = document.querySelector('select[name="ownership_type"]');
                                                                if (ownership) ownership.closest('.col-md-4')?.style.setProperty('display', '');

                                                            }

                                                            function applyShopRules() {

                                                                const subtype = document.getElementById('property_subtype')?.value;
                                                                if (subtype !== 'shop') return;

                                                                [
                                                                    'balcony_wrapper',
                                                                    'villa-specific-fields',
                                                                    'bedrooms-section',
                                                                    'compound_wall_wrapper',
                                                                    'pantry_area_wrapper'
                                                                ].forEach(hide);

                                                                const bathroomsInp = document.getElementById('bathrooms');
                                                                if (bathroomsInp) bathroomsInp.removeAttribute('required');
                                                                const ownershipWrapper = document.getElementById('ownership_wrapper');
                                                                if (ownershipWrapper) ownershipWrapper.style.setProperty('display', '', 'important');

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
                                                                    'ownership_wrapper',
                                                                    'corner_property_wrapper',
                                                                    'property_suitable_for_wrapper',
                                                                    'utility_area_wrapper',
                                                                    'loading_unloading_wrapper',
                                                                    'key_specifications_wrapper'
                                                                ].forEach(show);

                                                                const tenantWrapper = document.getElementById('tenant_preference_wrapper');
                                                                if (tenantWrapper) {
                                                                    const propFor = document.querySelector('input[name="property_for"]:checked')?.value;
                                                                    tenantWrapper.style.setProperty('display', propFor === 'sell' ? 'none' : '', 'important');
                                                                }
                                                            }

                                                            function applyStep2Rules() {
                                                                applyLandRules();
                                                                applyShopRules();
                                                            }

                                                            document.addEventListener('DOMContentLoaded', applyStep2Rules);
                                                            document.addEventListener('change', () => setTimeout(applyStep2Rules, 0));
                                                            document.addEventListener('click', () => setTimeout(applyStep2Rules, 0));

                                                        })();

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

                                                                const ownershipWrapper = document.getElementById('ownership_wrapper');
                                                                if (ownershipWrapper) {
                                                                    ownershipWrapper.style.setProperty('display', '', 'important');
                                                                    const companyOwnedOpt = ownershipWrapper.querySelector('option[value="Company Owned"]');
                                                                    if (companyOwnedOpt) {
                                                                        if (subtype === 'plot') {
                                                                            companyOwnedOpt.style.display = 'none';
                                                                            const sel = ownershipWrapper.querySelector('select');
                                                                            if (sel && sel.value === 'Company Owned') sel.value = '';
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

                                                                const shopParkingCard2 = document.getElementById('parking_card');
                                                                if (shopParkingCard2) shopParkingCard2.style.setProperty('display', '', 'important');
                                                                document.querySelectorAll('input[name="parking_availability"]').forEach(el => {
                                                                    const wrapper = el.closest('.col-md-4, .col-md-6');
                                                                    if (wrapper) wrapper.style.setProperty('display', '', 'important');
                                                                });
                                                                const shopParkingTypeDiv2 = document.getElementById('parking_type_div');
                                                                const shopParkingSlotsWrapper2 = document.getElementById('parking_slots_wrapper');
                                                                const shopParkingYesChecked2 = document.querySelector('input[name="parking_availability"][value="Yes"]')?.checked;
                                                                if (shopParkingTypeDiv2) shopParkingTypeDiv2.style.setProperty('display', shopParkingYesChecked2 ? 'block' : 'none', 'important');
                                                                if (shopParkingSlotsWrapper2) shopParkingSlotsWrapper2.style.setProperty('display', shopParkingYesChecked2 ? 'block' : 'none', 'important');

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
                                                                    'corner_property_wrapper',
                                                                    'property_suitable_for_wrapper',
                                                                    'utility_area_wrapper',
                                                                    'loading_unloading_wrapper',
                                                                    'key_specifications_wrapper'
                                                                ].forEach(id => {
                                                                    const el = document.getElementById(id);
                                                                    if (el) el.style.setProperty('display', '', 'important');
                                                                });

                                                                const bathInp = document.getElementById('bathrooms');
                                                                if (bathInp) bathInp.removeAttribute('required');

                                                                const resGroup = document.getElementById('residential_tenant_prefs');
                                                                const commGroup = document.getElementById('commercial_tenant_prefs');
                                                                if (resGroup) resGroup.style.display = 'none';
                                                                if (commGroup) commGroup.style.display = 'block';

                                                                const tenantWrapper = document.getElementById('tenant_preference_wrapper');
                                                                if (tenantWrapper) {
                                                                    const propFor = document.querySelector('input[name="property_for"]:checked')?.value;
                                                                    tenantWrapper.style.setProperty('display', propFor === 'sell' ? 'none' : '', 'important');
                                                                }

                                                                const ownership = document.querySelector('[name="ownership_type"]');
                                                                if (ownership) ownership.closest('.col-md-4')
                                                                    ?.style.setProperty('display', '');

                                                            }

                                                            document.addEventListener('DOMContentLoaded', applyShopStep2);
                                                            document.addEventListener('change', () => setTimeout(applyShopStep2, 0));
                                                            document.addEventListener('click', () => setTimeout(applyShopStep2, 0));

                                                        })();

                                                        (function() {

                                                            function applyBuildingStep2() {

                                                                const subtype = document.getElementById('property_subtype')?.value;
                                                                if (subtype !== 'building') return;

                                                                [
                                                                    'balcony',
                                                                    'bedrooms',
                                                                    'garden',
                                                                    'swimming_pool',
                                                                    'compound_wall',
                                                                    'pantry_area',
                                                                    'house_type',
                                                                    'construction_age',
                                                                    'furnishing_type',
                                                                    'water_supply',
                                                                    'food_preference',
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

                                                                const parkingCard = document.getElementById('parking_card');
                                                                if (parkingCard) parkingCard.style.setProperty('display', '', 'important');
                                                                const parkingTypeDiv = document.getElementById('parking_type_div');
                                                                const parkingSlotsWrapper = document.getElementById('parking_slots_wrapper');
                                                                const parkingYesChecked = document.querySelector('input[name="parking_availability"][value="Yes"]')?.checked;
                                                                if (parkingTypeDiv) parkingTypeDiv.style.setProperty('display', parkingYesChecked ? 'block' : 'none', 'important');
                                                                if (parkingSlotsWrapper) parkingSlotsWrapper.style.setProperty('display', parkingYesChecked ? 'block' : 'none', 'important');

                                                                [
                                                                    'corner_property_wrapper',
                                                                    'property_suitable_for_wrapper',
                                                                    'utility_area_wrapper',
                                                                    'key_specifications_wrapper'
                                                                ].forEach(id => {
                                                                    const el = document.getElementById(id);
                                                                    if (el) el.style.setProperty('display', '', 'important');
                                                                });

                                                                const bath = document.querySelector('[name="bathrooms"]');
                                                                if (bath) {
                                                                    bath.closest('.col-md-4')
                                                                        ?.style.setProperty('display', '', 'important');
                                                                    bath.setAttribute('required', 'required');
                                                                }

                                                                const resGroup = document.getElementById('residential_tenant_prefs');
                                                                const commGroup = document.getElementById('commercial_tenant_prefs');
                                                                if (resGroup) resGroup.style.display = 'none';
                                                                if (commGroup) commGroup.style.display = 'block';

                                                                const tenantWrapper = document.getElementById('tenant_preference_wrapper');
                                                                if (tenantWrapper) {
                                                                    const propFor = document.querySelector('input[name="property_for"]:checked')?.value;
                                                                    tenantWrapper.style.setProperty('display', propFor === 'sell' ? 'none' : '', 'important');
                                                                }

                                                                const ownership = document.querySelector('[name="ownership_type"]');
                                                                if (ownership) ownership.closest('.col-md-4')
                                                                    ?.style.setProperty('display', '', 'important');

                                                            }

                                                            document.addEventListener('DOMContentLoaded', applyBuildingStep2);
                                                            document.addEventListener('change', () => setTimeout(applyBuildingStep2, 0));
                                                            document.addEventListener('click', () => setTimeout(applyBuildingStep2, 0));

                                                        })();

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
                                                                    'house_type',
                                                                    'construction_age',
                                                                    'furnishing_type',
                                                                    'water_supply',
                                                                    'food_preference',
                                                                    'pet_policy'
                                                                ].forEach(name => {
                                                                    document.querySelectorAll(`[name="${name}"], [name="${name}[]"]`).forEach(el => {
                                                                        const col = el.closest('.col-md-4, .col-md-6, .col-md-12');
                                                                        if (col) col.style.setProperty('display', 'none', 'important');
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

                                                                [
                                                                    'corner_property_wrapper',
                                                                    'property_suitable_for_wrapper',
                                                                    'utility_area_wrapper',
                                                                    'loading_unloading_wrapper',
                                                                    'key_specifications_wrapper'
                                                                ].forEach(id => {
                                                                    const el = document.getElementById(id);
                                                                    if (el) el.style.setProperty('display', 'block', 'important');
                                                                });

                                                                const bath = document.querySelector('[name="bathrooms"]');
                                                                if (bath) {
                                                                    bath.closest('.col-md-4')?.style.setProperty('display', 'block', 'important');
                                                                    bath.setAttribute('required', 'required');
                                                                }

                                                                const resGroup = document.getElementById('residential_tenant_prefs');
                                                                const commGroup = document.getElementById('commercial_tenant_prefs');
                                                                if (resGroup) resGroup.style.display = 'none';
                                                                if (commGroup) commGroup.style.display = 'block';

                                                                const tenantWrapper = document.getElementById('tenant_preference_wrapper');
                                                                if (tenantWrapper) {
                                                                    const propFor = document.querySelector('input[name="property_for"]:checked')?.value;
                                                                    tenantWrapper.style.setProperty('display', propFor === 'sell' ? 'none' : '', 'important');
                                                                }

                                                                document.querySelectorAll('.tenant-check').forEach(cb => {
                                                                    const col = cb.closest('.col-md-6, .col-md-3, .form-check');
                                                                    if (col) col.style.setProperty('display', 'block', 'important');
                                                                });

                                                                const ownership = document.querySelector('[name="ownership_type"]');
                                                                if (ownership) {
                                                                    ownership.closest('.col-md-4')?.style.setProperty('display', 'block', 'important');
                                                                    ownership.setAttribute('required', 'required');
                                                                }

                                                                const loadingWrapper = document.getElementById('loading_unloading_wrapper');
                                                                const loadingRequired = document.getElementById('loading_unloading_required');
                                                                if (loadingWrapper) {
                                                                    loadingWrapper.style.setProperty('display', 'block', 'important');
                                                                }
                                                                if (loadingRequired) {
                                                                    loadingRequired.style.display = 'inline';
                                                                }
                                                            }

                                                            document.addEventListener('DOMContentLoaded', applyGodownWarehouseStep2);
                                                            document.addEventListener('change', () => setTimeout(applyGodownWarehouseStep2, 0));
                                                            document.addEventListener('click', () => setTimeout(applyGodownWarehouseStep2, 0));

                                                        })();

                                                        (function() {

                                                            function applyOfficeSpaceStep2() {

                                                                const subtype = document.getElementById('property_subtype')?.value;
                                                                if (subtype !== 'office_space') return;

                                                                [
                                                                    'balcony',
                                                                    'bedrooms',
                                                                    'garden',
                                                                    'swimming_pool',
                                                                    'corner_property',
                                                                    'compound_wall',
                                                                    'utility_area',
                                                                    'loading_unloading_facility',
                                                                    'house_type',
                                                                    'construction_age',
                                                                    'furnishing_type',
                                                                    'water_supply',
                                                                    'food_preference',
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
                                                                    'corner_property_wrapper',
                                                                    'compound_wall_wrapper',
                                                                    'utility_area_wrapper',
                                                                    'loading_unloading_wrapper'
                                                                ].forEach(id => {
                                                                    const el = document.getElementById(id);
                                                                    if (el) el.style.setProperty('display', 'none', 'important');
                                                                });

                                                                [
                                                                    'property_suitable_for_wrapper',
                                                                    'pantry_area_wrapper',
                                                                    'key_specifications_wrapper',
                                                                    'parking_card'
                                                                ].forEach(id => {
                                                                    const el = document.getElementById(id);
                                                                    if (el) el.style.setProperty('display', '', 'important');
                                                                });

                                                                document.querySelectorAll('input[name="parking_availability"]').forEach(el => {
                                                                    const wrapper = el.closest('.col-md-4, .col-md-6');
                                                                    if (wrapper) wrapper.style.removeProperty('display');
                                                                });

                                                                const bath = document.querySelector('[name="bathrooms"]');
                                                                if (bath) {
                                                                    bath.closest('.col-md-4')
                                                                        ?.style.setProperty('display', '', 'important');
                                                                    bath.setAttribute('required', 'required');
                                                                }

                                                                const resGroup = document.getElementById('residential_tenant_prefs');
                                                                const commGroup = document.getElementById('commercial_tenant_prefs');
                                                                if (resGroup) resGroup.style.display = 'none';
                                                                if (commGroup) commGroup.style.display = 'block';

                                                                const tenantWrapper = document.getElementById('tenant_preference_wrapper');
                                                                if (tenantWrapper) {
                                                                    const propFor = document.querySelector('input[name="property_for"]:checked')?.value;
                                                                    tenantWrapper.style.setProperty('display', propFor === 'sell' ? 'none' : '', 'important');
                                                                }

                                                                const ownership = document.querySelector('[name="ownership_type"]');
                                                                if (ownership) ownership.closest('.col-md-4')
                                                                    ?.style.setProperty('display', '', 'important');
                                                            }

                                                            document.addEventListener('DOMContentLoaded', applyOfficeSpaceStep2);
                                                            document.addEventListener('change', () => setTimeout(applyOfficeSpaceStep2, 0));
                                                            document.addEventListener('click', () => setTimeout(applyOfficeSpaceStep2, 0));

                                                        })();
                                                    </script>

                                                    <style>
                                                        .custom-radio-card {
                                                            position: relative;
                                                        }

                                                        .custom-radio-card input[type="radio"] {
                                                            display: none;
                                                        }

                                                        .custom-radio-card label {
                                                            padding: 8px 22px;

                                                            border-radius: 999px;
                                                            cursor: pointer;

                                                            background: #fff;
                                                            transition: all 0.2s ease;
                                                            font-weight: 500;
                                                        }

                                                        .custom-radio-card.active label {
                                                            background-color: #153d77;
                                                            color: #fff;
                                                            border-color: #153d77;
                                                        }

                                                        .custom-radio-card label:hover {
                                                            background-color: #f0f6ff;
                                                        }
                                                    </style>

                                                    <div id="corner_property_wrapper" class="col-md-4 mb-3 d-none">
                                                        <label class="form-label">Corner Property</label>
                                                        <div class="d-flex gap-3 pt-2">
                                                            <div class="form-check custom-radio-card">
                                                                <input class="form-check-input" type="radio"
                                                                    name="corner_property" id="corner_yes" value="Yes">
                                                                <label class="form-check-label" for="corner_yes">Yes</label>
                                                            </div>
                                                            <div class="form-check custom-radio-card">
                                                                <input class="form-check-input" type="radio"
                                                                    name="corner_property" id="corner_no" value="No">
                                                                <label class="form-check-label" for="corner_no">No</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="compound_wall_wrapper" class="col-md-4 mb-3 d-none">
                                                        <label class="form-label">Compound Wall</label>
                                                        <div class="d-flex gap-3 pt-2">
                                                            <div class="form-check custom-radio-card">
                                                                <input class="form-check-input" type="radio"
                                                                    name="compound_wall" id="compound_yes" value="Yes">
                                                                <label class="form-check-label" for="compound_yes">Yes</label>
                                                            </div>
                                                            <div class="form-check custom-radio-card">
                                                                <input class="form-check-input" type="radio"
                                                                    name="compound_wall" id="compound_no" value="No">
                                                                <label class="form-check-label" for="compound_no">No</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="property_suitable_for_wrapper" class="col-md-6 mb-3 d-none">
                                                        <label class="form-label">Property Suitable For <span
                                                                class="text-danger">*</span></label>
                                                        <input type="text" class="form-control" name="property_suitable_for"
                                                            placeholder="Eg: Food, Healthcare, Studio" required>
                                                    </div>
                                                    <div id="utility_area_wrapper" class="col-md-4 mb-3 d-none">
                                                        <label class="form-label">Utility Area</label>
                                                        <div class="d-flex gap-3 pt-2">
                                                            <div class="form-check custom-radio-card">
                                                                <input class="form-check-input" type="radio"
                                                                    name="utility_area" id="utility_yes" value="Yes">
                                                                <label class="form-check-label" for="utility_yes">Yes</label>
                                                            </div>
                                                            <div class="form-check custom-radio-card">
                                                                <input class="form-check-input" type="radio"
                                                                    name="utility_area" id="utility_no" value="No">
                                                                <label class="form-check-label" for="utility_no">No</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="loading_unloading_wrapper" class="col-md-4 mb-3 d-none">
                                                        <label class="form-label">Loading / Unloading Facility <span
                                                                id="loading_unloading_required" class="text-danger"
                                                                style="display: none;">*</span></label>
                                                        <div class="d-flex gap-3 pt-2">
                                                            <div class="form-check custom-radio-card">
                                                                <input class="form-check-input" type="radio"
                                                                    name="loading_unloading_facility" id="loading_yes"
                                                                    value="Yes">
                                                                <label class="form-check-label" for="loading_yes">Yes</label>
                                                            </div>
                                                            <div class="form-check custom-radio-card">
                                                                <input class="form-check-input" type="radio"
                                                                    name="loading_unloading_facility" id="loading_no"
                                                                    value="No">
                                                                <label class="form-check-label" for="loading_no">No</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="pantry_area_wrapper" class="col-md-4 mb-3 d-none">
                                                        <label class="form-label">Pantry Area</label>
                                                        <div class="d-flex gap-3 pt-2">
                                                            <div class="form-check custom-radio-card">
                                                                <input class="form-check-input" type="radio" name="pantry_area"
                                                                    id="pantry_yes" value="Yes">
                                                                <label class="form-check-label" for="pantry_yes">Yes</label>
                                                            </div>
                                                            <div class="form-check custom-radio-card">
                                                                <input class="form-check-input" type="radio" name="pantry_area"
                                                                    id="pantry_no" value="No">
                                                                <label class="form-check-label" for="pantry_no">No</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4 mb-3" id="ownership_wrapper" style="display:none;">
                                                        <label class="form-label">Ownership <span
                                                                class="text-danger">*</span></label>
                                                        <select class="form-select" name="ownership_type">
                                                            <option value="">Select</option>
                                                            <option value="Fully Owned">Fully Owned</option>
                                                            <option value="On Lease">On Lease</option>
                                                            <option value="Shared Ownership">Shared Ownership</option>
                                                            <option value="Company Owned">Company Owned</option>
                                                        </select>
                                                    </div>
                                                    <div id="key_specifications_wrapper" class="col-md-12 mb-3 d-none">
                                                        <div class="card">
                                                            <div class="card-header fw-bold">Key Specifications</div>
                                                            <div class="card-body" id="keySpecificationsContainer">
                                                                <div class="row key-specification-row mb-2">
                                                                    <div class="col-md-10">
                                                                        <input type="text" class="form-control"
                                                                            name="key_specifications[]"
                                                                            placeholder="Eg: 1st Floor, Parking, Lift, Power Backup">
                                                                    </div>
                                                                    <div class="col-md-2">
                                                                        <button type="button" class="btn btn-outline-dark"
                                                                            onclick="removeRow(this)">
                                                                            <i class="fa fa-trash"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                class="container d-flex justify-content-between align-items-center mb-2">
                                                                <button type="button" class="btn btn-outline-dark mt-2"
                                                                    onclick="addSpecification()">
                                                                    <i class="fa fa-plus"></i> Add Specification
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4 mb-3">
                                                        <label class="form-label">Furnishing <span
                                                                class="text-danger">*</span></label>
                                                        <select class="form-select" name="furnishing_type">
                                                            <option value="">Select</option>
                                                            <option value="Furnished">Furnished</option>
                                                            <option value="Semi-Furnished">Semi-Furnished</option>
                                                            <option value="Unfurnished">Unfurnished</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-4 mb-3">
                                                        <label class="form-label">Water Supply</label>
                                                        <select class="form-select" name="water_supply">
                                                            <option value="">Select</option>
                                                            <option value="Borewell">Borewell</option>
                                                            <option value="Corporation">Corporation</option>
                                                            <option value="Both">Both</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-4 mb-3">
                                                        <label class="form-label">Food Preference <span
                                                                class="text-danger">*</span></label>
                                                        <select class="form-select" name="food_preference">
                                                            <option value="">Select</option>
                                                            <option value="Veg">Veg</option>
                                                            <option value="Non-Veg">Non-Veg</option>
                                                            <option value="No Restrictions">No Restrictions</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-4 mb-3">
                                                        <label class="form-label">Pet Policy <span
                                                                class="text-danger">*</span></label>
                                                        <div class="d-flex gap-3 pt-2">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio" name="pet_policy"
                                                                    id="pet_allowed" value="Allowed">
                                                                <label class="form-check-label" for="pet_allowed">Allowed</label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="radio" name="pet_policy"
                                                                    id="pet_not_allowed" value="Not Allowed">
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
                                                                <label class="form-label">Parking Availability <span
                                                                        class="text-danger">*</span></label>
                                                                <div class="d-flex gap-3 pt-2">
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio"
                                                                            name="parking_availability" id="parking_yes"
                                                                            value="Yes">
                                                                        <label class="form-check-label"
                                                                            for="parking_yes">Yes</label>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio"
                                                                            name="parking_availability" id="parking_no"
                                                                            value="No">
                                                                        <label class="form-check-label"
                                                                            for="parking_no">No</label>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div class="col-md-8" id="parking_type_div" style="display: none;">
                                                                <div class="row align-items-center">
                                                                    <div class="col-md-6">
                                                                        <label class="form-label">Parking Type</label>
                                                                        <div class="d-flex gap-3 pt-2">
                                                                            <div class="form-check">
                                                                                <input class="form-check-input" type="checkbox"
                                                                                    name="parking_type[]" id="parking_bike"
                                                                                    value="Bike">
                                                                                <label class="form-check-label"
                                                                                    for="parking_bike">Bike</label>
                                                                            </div>
                                                                            <div class="form-check">
                                                                                <input class="form-check-input" type="checkbox"
                                                                                    name="parking_type[]" id="parking_car"
                                                                                    value="Car">
                                                                                <label class="form-check-label"
                                                                                    for="parking_car">Car</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-md-6" id="parking_slots_wrapper">
                                                                        <label class="form-label">No. of Slots</label>
                                                                        <input type="number" class="form-control number-only"
                                                                            name="parking_slots_count" id="parking_slots_count"
                                                                            placeholder="Eg: 2">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mb-4 mt-4 p-3 bg-white rounded border" id="rent_lease_toggle_section">
                                                    <label class="form-label d-block fw-bold mb-2">Are you going to ... <span
                                                            class="text-danger">*</span></label>
                                                    <div class="d-flex flex-wrap gap-3">
                                                        <div class="form-check form-check-inline custom-radio-card">
                                                            <input type="radio" class="form-check-input" name="rent_lease_type"
                                                                id="rent_type" value="rent"
                                                                {{ old('rent_lease_type') == 'rent' ? 'checked' : '' }}
                                                                onchange="step2_updateRentLeaseType()">
                                                            <label class="form-check-label" for="rent_type">Rent</label>
                                                        </div>
                                                        <div class="form-check form-check-inline custom-radio-card">
                                                            <input type="radio" class="form-check-input" name="rent_lease_type"
                                                                id="lease_type" value="lease"
                                                                {{ old('rent_lease_type') == 'lease' ? 'checked' : '' }}
                                                                onchange="step2_updateRentLeaseType()">
                                                            <label class="form-check-label" for="lease_type">Lease</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="card mb-3 shadow-sm" id="financial_details_card">
                                                    <div class="card-header fw-bold">Pricing Details</div>
                                                    <div class="card-body">
                                                        <div class="row mb-4 align-items-end">
                                                            <div class="col-md-6">
                                                                <label class="form-label" id="price_label">Price <span
                                                                        class="text-danger">*</span></label>
                                                                <input type="text" class="form-control price-input" name="price"
                                                                    id="price" maxlength="12" required
                                                                    oninput="enforcePriceMax(this); convertPriceToText(this.value, 'price_in_words_input')">
                                                            </div>
                                                            <div class="col-md-6">
                                                                <label class="form-label text-muted small">Amount in Words</label>
                                                                <input type="text" class="form-control bg-light border-0"
                                                                    id="price_in_words_input" readonly tabindex="-1">
                                                            </div>
                                                        </div>

                                                        <div class="row mb-4 align-items-end" id="security_deposit_section">
                                                            <div class="col-md-6">
                                                                <label class="form-label">Security Deposit <span
                                                                        class="text-danger">*</span></label>
                                                                <input type="text" class="form-control price-input"
                                                                    name="security_deposit" id="security_deposit_amount"
                                                                    placeholder="Enter Amount" required maxlength="12"
                                                                    oninput="formatIndianPrice(this); convertPriceToText(this.value.replace(/,/g,''), 'security_deposit_words_input')">
                                                            </div>
                                                            <div class="col-md-6" id="security_deposit_words_div">
                                                                <label class="form-label text-muted small">Amount in Words</label>
                                                                <input type="text" class="form-control bg-light border-0"
                                                                    id="security_deposit_words_input" readonly tabindex="-1">
                                                            </div>
                                                            <div class="col-md-6 mt-2">
                                                                <div class="d-flex gap-3">
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio"
                                                                            name="security_deposit_type" id="sec_fixed"
                                                                            value="Fixed">
                                                                        <label class="form-check-label" for="sec_fixed">Fixed</label>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio"
                                                                            name="security_deposit_type" id="sec_negotiable"
                                                                            value="Negotiable">
                                                                        <label class="form-check-label"
                                                                            for="sec_negotiable">Negotiable</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <!-- Row 3: Maintenance Charge (Add ID here) -->
                                                        <div class="row mb-4 align-items-end" id="maintenance_section">
                                                            <div class="col-md-6">
                                                                <label class="form-label">Maintenance Charge <span
                                                                        class="text-danger">*</span></label>
                                                                <div class="d-flex gap-3 mb-2">
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio"
                                                                            name="maintenance_charge_status" id="maint_yes"
                                                                            value="Yes" onclick="toggleMaintenance(true)">
                                                                        <label class="form-check-label" for="maint_yes">Yes</label>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio"
                                                                            name="maintenance_charge_status" id="maint_no"
                                                                            value="No" onclick="toggleMaintenance(false)">
                                                                        <label class="form-check-label" for="maint_no">No</label>
                                                                    </div>
                                                                </div>
                                                                <input type="text" class="form-control price-input"
                                                                    name="maintenance_charge_amount" id="maintenance_amount_input"
                                                                    placeholder="Enter Amount" style="display: none;" maxlength="12"
                                                                    oninput="formatIndianPrice(this); convertPriceToText(this.value.replace(/,/g,''), 'maintenance_charge_words_input')">
                                                            </div>
                                                            <div class="col-md-6" id="maintenance_words_div" style="display: none;">
                                                                <label class="form-label text-muted small">Amount in Words</label>
                                                                <input type="text" class="form-control bg-light border-0"
                                                                    id="maintenance_charge_words_input" readonly tabindex="-1">
                                                            </div>
                                                        </div>

                                                        <!-- Row 4: Lease Specific (Keep ID) -->
                                                        <div id="lease_specific_fields" style="display: none;">
                                                            <div class="row mb-3">
                                                                <div class="col-md-6">
                                                                    <label class="form-label">Lease Duration <span
                                                                            class="text-danger">*</span></label>
                                                                    <select class="form-select" name="lease_duration"
                                                                        id="lease_duration">
                                                                        <option value="">Select Duration</option>
                                                                        <option value="1 year">1 Year</option>
                                                                        <option value="2 years">2 Years</option>
                                                                        <option value="3 years">3 Years</option>
                                                                        <option value="> 3 years"> > 3 Years</option>
                                                                    </select>
                                                                </div>
                                                                <div class="col-md-6">
                                                                    <label class="form-label">Maintenance Responsibility <span
                                                                            class="text-danger">*</span></label>
                                                                    <select class="form-select" name="maintenance_responsibility"
                                                                        id="maintenance_responsibility">
                                                                        <option value="">Select</option>
                                                                        <option value="Tenant">Tenant</option>
                                                                        <option value="Owner">Owner</option>
                                                                        <option value="Shared">Shared</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div class="row">
                                                            <!-- Notice Period (Add ID here) -->
                                                            <div class="col-md-6 mb-3" id="notice_period_section">
                                                                <label class="form-label">Notice Period</label>
                                                                <select class="form-select" name="notice_period" id="notice_period">
                                                                    <option value="">Select Period</option>
                                                                    <option value="No-notice">No-notice</option>
                                                                    <option value="1 Month">1 Month</option>
                                                                    <option value="2 Months">2 Months</option>
                                                                    <option value="3 Months">3 Months</option>
                                                                    <option value="6 Months">6 Months</option>
                                                                </select>
                                                            </div>
                                                            <div class="col-md-6 mb-3">
                                                                <label class="form-label">Availability <span
                                                                        class="text-danger">*</span></label>
                                                                <select class="form-select mb-2" name="availability_status"
                                                                    id="availability_status" onchange="toggleAvailabilityDate()">
                                                                    <option value="Ready to occupy">Ready to Occupy</option>
                                                                    <option value="Available From">Available From</option>
                                                                </select>
                                                                <input type="date" class="form-control" name="availability_date"
                                                                    id="availability_date" style="display: none;">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="card mt-4 shadow-sm">
                                                    <div class="card-header bg-light">
                                                        <h6 class="mb-0">Images <small class="text-muted">(Max 2MB each)</small> -
                                                            <span id="image-limit-text" class="badge bg-primary">Up to 15</span></h6>
                                                    </div>
                                                    <div class="card-body">
                                                        <div class="alert alert-info py-2 small">
                                                            <i class="fas fa-info-circle"></i> Only JPG, JPEG, PNG formats allowed.
                                                        </div>
                                                        <div class="form-group">
                                                            <input type="file" class="form-control" name="images[]"
                                                                id="images" multiple accept="image/jpeg,image/jpg,image/png"
                                                                data-max-files="15">
                                                            <div id="preview-container" class="d-flex flex-wrap mt-3 gap-2"></div>
                                                            <div id="file-size-warning" class="text-danger mt-2 small"
                                                                style="display: none;">
                                                                <i class="fas fa-exclamation-triangle"></i> <span
                                                                    id="file-size-message"></span>
                                                            </div>
                                                            <div id="image-limit-warning" class="text-danger mt-2 small"
                                                                style="display: none;">
                                                                <i class="fas fa-exclamation-triangle"></i> <span
                                                                    id="image-limit-message"></span>
                                                            </div>
                                                            <div id="image-success-message" class="text-success mt-2 small"
                                                                style="display: none;">
                                                                <i class="fas fa-check-circle"></i> <span
                                                                    id="image-success-text"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="card mt-4 shadow-sm" id="auto-renewal-card" style="display: none;">
                                                    <div class="card-header bg-light">
                                                        <h6 class="mb-0">Auto-Renewal Options</h6>
                                                    </div>
                                                    <div class="card-body">
                                                        <div class="row">
                                                            <div class="col-md-6 mb-2">
                                                                <div class="form-check">
                                                                    <input type="checkbox" class="form-check-input"
                                                                        name="renew_24_hours" id="renew_24_hours" value="1">
                                                                    <label class="form-check-label" for="renew_24_hours">Renew
                                                                        automatically every 24 hours?</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-6 mb-2">
                                                                <div class="form-check">
                                                                    <input type="checkbox" class="form-check-input"
                                                                        name="renew_30_days" id="renew_30_days" value="1">
                                                                    <label class="form-check-label" for="renew_30_days">Renew
                                                                        automatically every 30 days?</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <script>
                                                function enforcePriceMax(input) {
                                                    input.value = input.value.replace(/[^0-9]/g, '');
                                                    if (input.value.length > 12) input.value = input.value.slice(0, 12);
                                                }

                                                function enforceNumberMax(input) {
                                                    if (input.value.length > 12) input.value = input.value.slice(0, 12);
                                                }

                                                function formatIndianPrice(input) {
                                                    let raw = input.value.replace(/[^0-9]/g, '');
                                                    if (raw.length > 12) raw = raw.slice(0, 12);
                                                    input.value = raw ? Number(raw).toLocaleString('en-IN') : '';
                                                }

                                                function step2_updateRentLeaseType() {
                                                    const propertyFor = document.querySelector('input[name="property_for"]:checked')?.value || 'sell';
                                                    const priceLabel = document.getElementById('price_label');
                                                    const priceInput = document.getElementById('price');
                                                    const leaseFields = document.getElementById('lease_specific_fields');
                                                    const securitySec = document.getElementById('security_deposit_section');
                                                    const maintenanceSec = document.getElementById('maintenance_section');
                                                    const noticeSec = document.getElementById('notice_period_section');
                                                    const financialCard = document.getElementById('financial_details_card');

                                                    if (propertyFor === 'rent_lease') {
                                                        const rentLeaseTypeChecked = document.querySelector('input[name="rent_lease_type"]:checked');

                                                        if (!rentLeaseTypeChecked) {
                                                            if (financialCard) financialCard.style.display = 'none';
                                                            return;
                                                        }

                                                        if (financialCard) financialCard.style.display = 'block';

                                                        const rentLeaseType = rentLeaseTypeChecked.value;

                                                        if (rentLeaseType === 'rent') {
                                                            if (priceLabel) priceLabel.innerHTML = 'Rent Amount <span class="text-danger">*</span>';
                                                            if (securitySec) securitySec.style.display = 'flex';
                                                            if (maintenanceSec) maintenanceSec.style.display = 'flex';
                                                            if (noticeSec) noticeSec.style.display = 'block';
                                                            if (leaseFields) leaseFields.style.display = 'none';
                                                        } else {
                                                            if (priceLabel) priceLabel.innerHTML = 'Lease Amount <span class="text-danger">*</span>';
                                                            if (securitySec) securitySec.style.display = 'none';
                                                            if (maintenanceSec) maintenanceSec.style.display = 'none';
                                                            if (noticeSec) noticeSec.style.display = 'none';
                                                            if (leaseFields) leaseFields.style.display = 'block';
                                                        }
                                                    } else {
                                                        if (financialCard) financialCard.style.display = 'block';
                                                        if (priceLabel) priceLabel.innerHTML = 'Price <span class="text-danger">*</span>';
                                                        if (leaseFields) leaseFields.style.display = 'none';
                                                        if (securitySec) securitySec.style.display = 'none';
                                                        if (maintenanceSec) maintenanceSec.style.display = 'none';
                                                        if (noticeSec) noticeSec.style.display = 'none';
                                                    }
                                                }

                                                document.addEventListener('DOMContentLoaded', function() {
                                                    document.querySelectorAll('input[name="rent_lease_type"]').forEach(radio => {
                                                        radio.addEventListener('change', step2_updateRentLeaseType);
                                                    });

                                                    document.querySelectorAll('input[name="property_for"]').forEach(radio => {
                                                        radio.addEventListener('change', step2_updateRentLeaseType);
                                                    });

                                                    step2_updateRentLeaseType();
                                                });

                                                document.addEventListener('DOMContentLoaded', function() {
                                                    function step1_updateFormLogic() {

                                                        const isSell = document.getElementById('for_sell')?.checked;

                                                        const sellOptions = document.getElementById('owner_options_for_sell');
                                                        const rentOptions = document.getElementById('owner_options_for_rent');
                                                        const warningMsg = document.getElementById('package_warning_msg');

                                                        if (isSell) {
                                                            if (sellOptions) sellOptions.style.display = 'block';
                                                            if (rentOptions) rentOptions.style.display = 'none';

                                                            const firstSell = sellOptions?.querySelector('.form-check-input');
                                                            if (firstSell) {
                                                                firstSell.checked = true;
                                                                if (warningMsg) warningMsg.style.display = 'none';
                                                            } else {
                                                                if (warningMsg) warningMsg.style.display = 'block';
                                                            }
                                                        } else {
                                                            if (sellOptions) sellOptions.style.display = 'none';
                                                            if (rentOptions) rentOptions.style.display = 'block';
                                                            if (warningMsg) warningMsg.style.display = 'none';

                                                            const ownerRent = document.getElementById('owner_owner_rent');
                                                            if (ownerRent) ownerRent.checked = true;
                                                        }

                                                        resetCategoryAndPropertyType();

                                                        if (typeof updateMainTypeVisibility === 'function') {
                                                            updateMainTypeVisibility();
                                                        }

                                                        if (typeof step2_updateRentLeaseType === 'function') {
                                                            step2_updateRentLeaseType();
                                                        }
                                                    }

                                                    function resetCategoryAndPropertyType() {

                                                        const wrapper = document.getElementById('property-type-wrapper');
                                                        if (wrapper) {
                                                            wrapper.querySelectorAll('button').forEach(btn => {
                                                                btn.classList.remove('btn-primary');
                                                                btn.classList.add('btn-outline-primary');
                                                            });
                                                        }

                                                        document.querySelectorAll('.dynamic-group').forEach(el => {
                                                            el.classList.add('d-none');
                                                        });

                                                        const subtypeInput = document.getElementById('property_subtype');
                                                        const categoryIdInput = document.getElementById('category_id');
                                                        if (subtypeInput) subtypeInput.value = '';
                                                        if (categoryIdInput) categoryIdInput.value = '';
                                                    }

                                                    window.step1_updatePropertyTypeButtons = function() {

                                                        const subtype = document.getElementById('property_subtype')?.value;

                                                        document.querySelectorAll('.dynamic-group').forEach(el => {
                                                            el.classList.add('d-none');
                                                        });

                                                        if (!subtype) return;

                                                        if (['plot', 'land', 'land_lease'].includes(subtype)) {

                                                            document.getElementById('field-group-plot')?.classList.remove('d-none');

                                                            var plotTitle = document.getElementById('plot-details-title');
                                                            var plotLabel = document.getElementById('label_plot_area');
                                                            if (subtype === 'plot') {
                                                                if (plotTitle) plotTitle.textContent = 'Plot Details';
                                                                if (plotLabel) plotLabel.innerHTML = 'Plot Area <span class="text-danger">*</span>';
                                                            } else {
                                                                if (plotTitle) plotTitle.textContent = 'Land Details';
                                                                if (plotLabel) plotLabel.innerHTML = 'Land Area <span class="text-danger">*</span>';
                                                            }

                                                        } else if (subtype === 'apartment') {

                                                            document.getElementById('field-group-structure')?.classList.remove('d-none');
                                                            document.getElementById('field-group-apartment')?.classList.remove('d-none');

                                                        } else if (subtype === 'shop') {

                                                            document.getElementById('field-group-structure')?.classList.remove('d-none');
                                                            document.getElementById('field-group-apartment')?.classList.remove('d-none');

                                                        } else {

                                                            document.getElementById('field-group-structure')?.classList.remove('d-none');

                                                        }
                                                    };

                                                    document.querySelectorAll('input[name="property_for"]').forEach(radio => {
                                                        radio.addEventListener('change', step1_updateFormLogic);
                                                    });

                                                    document.querySelectorAll('input[name="property_main_type"]').forEach(radio => {
                                                        radio.addEventListener('change', function() {
                                                            updateMainTypeVisibility();
                                                        });
                                                    });

                                                    step1_updateFormLogic();
                                                });

                                                document.addEventListener('DOMContentLoaded', function() {
                                                    initFormLogic();

                                                    const permalinkInput = document.getElementById('permalink');
                                                    if (permalinkInput) initPermalinkLogic();
                                                });
                                                
                                                function resetDynamicFields() {
                                                    document.querySelectorAll('.dynamic-group').forEach(el => el.classList.add('d-none'));

                                                    const storageWrapper = document.getElementById('storage_area_wrapper');
                                                    if (storageWrapper) {
                                                        storageWrapper.classList.add('d-none');
                                                        const storageInput = document.getElementById('input_storage_area');
                                                        if (storageInput) storageInput.removeAttribute('required');
                                                    }

                                                    const carpetArea = document.getElementById('col_carpet_area');
                                                    const carpetUnit = document.getElementById('col_carpet_unit');
                                                    const totalFloorsInput = document.getElementById('input_total_floors');
                                                    const propertyFloorInput = document.getElementById('input_property_on_floor');
                                                    if (carpetArea) carpetArea.style.display = 'none';
                                                    if (carpetUnit) carpetUnit.style.display = 'none';
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
                                                            if (propertyFor === 'sell') {
                                                                btnPlot.classList.remove('d-none');
                                                            } else {
                                                                btnPlot.classList.add('d-none');
                                                                const subtypeInput = document.getElementById('property_subtype');
                                                                if (subtypeInput && subtypeInput.value === 'plot') {
                                                                    subtypeInput.value = '';
                                                                    btnPlot.classList.remove('active');
                                                                }
                                                            }
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
                                                    const btnLandLease = document.getElementById('btn-land-lease');
                                                    if (btnPlot) {
                                                        btnPlot.classList.toggle('d-none', !(mainType === 'residential' && propertyFor === 'sell'));
                                                    }
                                                    if (mainType === 'residential') {
                                                        if (btnLand) btnLand.classList.add('d-none');
                                                        if (btnLandLease) btnLandLease.classList.add('d-none');
                                                        return;
                                                    }
                                                    if (propertyFor === 'sell') {
                                                        if (btnLand) btnLand.classList.remove('d-none');
                                                        if (btnLandLease) btnLandLease.classList.add('d-none');
                                                    } else {
                                                        if (btnLand) btnLand.classList.remove('d-none');
                                                        if (btnLandLease) btnLandLease.classList.add('d-none');
                                                    }
                                                }

                                                function initPermalinkLogic() {
                                                    const permalinkInput = document.getElementById('permalink');
                                                    const permalinkPreview = document.getElementById('permalink-preview');
                                                    const nameInput = document.getElementById('name');
                                                    let debounceTimer;
                                                    window.permalinkIsValid = null;

                                                    function checkPermalink(slug) {
                                                        if (!slug.trim()) return;

                                                        fetch('{{ route('check.slug.unique') }}', {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                                                                },
                                                                body: JSON.stringify({
                                                                    permalink: slug,
                                                                    property_id: 'null'
                                                                })
                                                            })
                                                            .then(res => res.json())
                                                            .then(data => {
                                                                const feedback = document.getElementById('permalink-feedback');
                                                                if (feedback) {
                                                                    if (data.unique) {
                                                                        feedback.innerHTML ='<span class="text-success">Permalink is unique and available!</span>';
                                                                        permalinkInput.classList.remove('is-invalid');
                                                                        permalinkInput.classList.add('is-valid');
                                                                        window.permalinkIsValid = true;
                                                                    } else {
                                                                        feedback.innerHTML =`<span class="text-danger">Permalink taken. Try: <b>${data.suggested_slug}</b></span>`;
                                                                        permalinkInput.classList.add('is-invalid');
                                                                        window.permalinkIsValid = null;
                                                                    }
                                                                }
                                                            })
                                                            .catch(err => console.error(err));
                                                    }

                                                    let isEdited = false;
                                                    permalinkInput.addEventListener('input', function() {
                                                        isEdited = true;
                                                        if (permalinkPreview) permalinkPreview.textContent = this.value;
                                                        clearTimeout(debounceTimer);
                                                        debounceTimer = setTimeout(() => checkPermalink(this.value), 500);
                                                    });

                                                    if (nameInput) {
                                                        nameInput.addEventListener('input', function() {
                                                            if (!isEdited) {
                                                                let slug = this.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
                                                                    .replace(/\-+/g, '-');
                                                                permalinkInput.value = slug;
                                                                if (permalinkPreview) permalinkPreview.textContent = slug;
                                                                clearTimeout(debounceTimer);
                                                                debounceTimer = setTimeout(() => checkPermalink(slug), 500);
                                                            }
                                                        });
                                                    }
                                                }

                                                function switchTenantPreferences(subtype) {
                                                    const resGroup = document.getElementById('residential_tenant_prefs');
                                                    const commGroup = document.getElementById('commercial_tenant_prefs');
                                                    const commercialTypes = ['land', 'land_lease', 'shop', 'building', 'godown', 'warehouse',
                                                        'office_space'];

                                                    if (commercialTypes.includes(subtype)) {
                                                        if (resGroup) resGroup.style.display = 'none';
                                                        if (commGroup) commGroup.style.display = 'block';
                                                    } else {
                                                        if (resGroup) resGroup.style.display = 'block';
                                                        if (commGroup) commGroup.style.display = 'none';
                                                    }
                                                    document.querySelectorAll('input[name="tenant_preference[]"]').forEach(cb => {
                                                        cb.checked = false;
                                                    });
                                                }

                                                document.querySelectorAll('input[name="parking_availability"]').forEach(function(radio) {
                                                    radio.addEventListener('change', function() {
                                                        var typeDiv = document.getElementById('parking_type_div');
                                                        var slotsWrapper = document.getElementById('parking_slots_wrapper');
                                                        var slotsInput = document.getElementById('parking_slots_count');
                                                        var parkingTypeInputs = document.querySelectorAll('input[name="parking_type[]"]');

                                                        if (this.value === 'Yes') {
                                                            typeDiv.style.display = 'block';
                                                            slotsWrapper.style.display = 'block';
                                                        } else {
                                                            typeDiv.style.setProperty('display', 'none', 'important');
                                                            slotsWrapper.style.setProperty('display', 'none', 'important');
                                                            parkingTypeInputs.forEach(function(cb) {
                                                                cb.checked = false;
                                                            });
                                                            slotsInput.value = '';
                                                        }
                                                    });
                                                });

                                                (function() {

                                                    function forceResidentialLock() {

                                                        const mainType = document.querySelector('input[name="property_main_type"]:checked')?.value;

                                                        if (mainType !== 'residential') return;

                                                        const wrapper = document.getElementById('property-type-wrapper');
                                                        if (!wrapper) return;

                                                        const commercialBtns = wrapper.querySelectorAll('.com-type');
                                                        const residentialBtns = wrapper.querySelectorAll('.res-type');
                                                        commercialBtns.forEach(btn => {
                                                            btn.classList.add('d-none');
                                                            btn.classList.remove('btn-primary');
                                                            btn.classList.add('btn-outline-primary');
                                                        });
                                                        residentialBtns.forEach(btn => {
                                                            btn.classList.remove('d-none');
                                                        });
                                                        const subtypeInput = document.getElementById('property_subtype');
                                                        if (subtypeInput && !['apartment', 'villa', 'individual_house'].includes(subtypeInput.value)) {
                                                            subtypeInput.value = '';
                                                        }
                                                    }
                                                    document.addEventListener('DOMContentLoaded', forceResidentialLock);

                                                    document.querySelectorAll(
                                                        'input[name="property_main_type"], input[name="owner_type"], input[name="property_for"]'
                                                    ).forEach(el => {
                                                        el.addEventListener('change', () => {
                                                            setTimeout(forceResidentialLock, 0);
                                                        });
                                                    });

                                                })();
                                            </script>

                                            <div class="form-step d-none" id="step-3">
                                                <h5>Step 3: Property Location</h5>
                                                <div class="form-group w-100">
                                                    <label for="state">State <span class="text-danger">*</span> </label>
                                                    <select class="form-control w-100" name="state_id" id="state" required>
                                                        <option value="">Select State </option>
                                                        @foreach ($states as $state)
                                                            <option value="{{ $state->id }}">{{ $state->name }}</option>
                                                        @endforeach
                                                    </select>
                                                    @error('state')
                                                        <span class="text-danger">{{ $message }}</span>
                                                    @enderror
                                                </div>

                                                <div class="form-group w-100">
                                                    <label for="city">City <span class="text-danger">*</span> </label>
                                                    <select class="form-control w-100" name="city_id" id="city" required>
                                                        <option value="">Select City</option>
                                                    </select>
                                                    @error('city')
                                                        <span class="text-danger">{{ $message }}</span>
                                                    @enderror
                                                </div>

                                                <div class="form-group">
                                                    <label for="location">Property Location <span class="text-danger">*</span></label>
                                                    <input type="text" class="form-control" name="location" id="location" placeholder="Enter property location" required>
                                                    @error('location')
                                                        <span class="text-danger">{{ $message }}</span>
                                                    @enderror
                                                </div>
                                            </div>

                                            <div class="form-step d-none" id="step-4">
                                                <h5>Step 4: Amenities and Extra Info</h5>
                                                <div class="card mt-3">
                                                    <div class="card-header bg-secondary text-white">Nearby Key
                                                        Facilities
                                                    </div>
                                                    <div class="card-body" id="facilitiesContainer">
                                                        <div class="row facilities">
                                                            <div class="col-md-5">
                                                                <select class="form-control" name="facilities[]">
                                                                    <option value="">Select Facility</option>
                                                                    @foreach ($product_cate as $facility)
                                                                        <option value="{{ $facility->id }}" required>
                                                                            {{ $facility->name }}</option>
                                                                    @endforeach
                                                                </select>
                                                            </div>
                                                            <div class="col-md-5 position-relative mb-4">
                                                                <input type="text" class="form-control facility-value-input mb-1"
                                                                    name="facility_values[]" maxlength="50"
                                                                    placeholder="Distance (E.g: 200m , 1km..) from here">
                                                                <small class="char-counter text-muted"
                                                                    style="position:absolute;right:10px;bottom:-20px;">50/50</small>
                                                            </div>
                                                            <div class="col-md-2">
                                                                <button type="button" class="btn btn-outline-dark"
                                                                    onclick="removeRow(this)">
                                                                    <i class="fa fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="container d-flex justify-content-between align-items-center mb-2">
                                                        <button type="button" class="btn btn-outline-dark mt-2"
                                                            onclick="addFacility()">
                                                            <i class="fa fa-plus"></i> Add Facility
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="card mt-3">
                                                    <div class="card-header bg-secondary text-white">Features</div>
                                                    <div class="card-body">
                                                        <div class="row">
                                                            @foreach ($amenities as $amenity)
                                                                @if ($amenity->key_status == 0)
                                                                    <div class="col-md-3 mb-2">
                                                                        <div class="form-check d-flex align-items-center">
                                                                            <input type="checkbox" name="amenities[]"
                                                                                class="form-check-input feature-checkbox"
                                                                                id="amenity_{{ $amenity->keyid }}"
                                                                                value="{{ $amenity->keyid }}">
                                                                            <label class="form-check-label ms-2"
                                                                                for="amenity_{{ $amenity->keyid }}">
                                                                                {{ $amenity->keyfeatures_name }}
                                                                                <span class="tick-icon"
                                                                                    style="display:none; color:white; margin-left:5px;">&#10003;</span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                @endif
                                                            @endforeach
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group mt-4 p-3 rounded" id="direction-facing-group">
                                                    <label for="direction_facing" class="mb-2">Direction Facing <span
                                                            class="text-danger d-none"
                                                            id="direction_facing_required_star">*</span></label>
                                                    <select class="form-control" name="direction_facing" id="direction_facing">
                                                        <option value="">Select Direction</option>
                                                        <option value="East">East</option>
                                                        <option value="West">West</option>
                                                        <option value="North">North</option>
                                                        <option value="South">South</option>
                                                        <option value="North-East">North-East</option>
                                                        <option value="North-West">North-West</option>
                                                        <option value="South-East">South-East</option>
                                                        <option value="South-West">South-West</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div class="form-step d-none" id="step-5">
                                                <div id="brokerTypeContainer" style="display: none;" class="mt-4">
                                                    <div class="form-group d-flex flex-wrap align-items-center gap-3">
                                                        <label class="mb-0 me-2" style="white-space:nowrap;">Brokerage Type <span
                                                                class="text-danger">*</span></label>
                                                        <div class="d-flex flex-wrap gap-2 w-100 w-md-auto">
                                                            <div class="form-check form-check-inline mb-2 mb-md-0">
                                                                <input class="form-check-input" type="radio"
                                                                    name="brokerage_type" id="no_brokerage" value="no_brokerage">
                                                                <label class="form-check-label" for="no_brokerage">No
                                                                    Brokerage</label>
                                                            </div>
                                                            <div class="form-check form-check-inline mb-2 mb-md-0">
                                                                <input class="form-check-input" type="radio"
                                                                    name="brokerage_type" id="fixed_brokerage" value="fixed">
                                                                <label class="form-check-label" for="fixed_brokerage">Fixed</label>
                                                            </div>
                                                            <div class="form-check form-check-inline mb-2 mb-md-0">
                                                                <input class="form-check-input" type="radio"
                                                                    name="brokerage_type" id="percentage_brokerage"
                                                                    value="percentage">
                                                                <label class="form-check-label"
                                                                    for="percentage_brokerage">Percentage</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id="brokerage_type_error" class="text-danger dynamic-error"></div>
                                                @error('brokerage_type')
                                                    <span class="text-danger">{{ $message }}</span>
                                                @enderror

                                                <div class="form-group" id="brokerFeeContainer" style="display: none;">
                                                    <label for="brokerage_fee" id="brokerage_fee_label">Broker Fee <span
                                                            class="text-danger">*</span></label>
                                                    <input type="text" class="form-control" id="brokerage_fee"
                                                        name="brokerage_fee" placeholder="Enter amount"
                                                        oninput="this.value=this.value.replace(/[^0-9]/g,'')">
                                                </div>
                                                <div id="seo-section" style="display: none;">
                                                    <div class="card mt-4">
                                                        <div class="card-header bg-secondary text-white">
                                                            SEO Section
                                                        </div>
                                                        <div class="card-body">
                                                            <div class="form-group position-relative">
                                                                <label for="seo_title" class="form-label">SEO Title</label>
                                                                <input type="text" class="form-control mb-1"
                                                                    placeholder="SEO Title" name="seo_title" id="seo_title"
                                                                    maxlength="70">
                                                                <small class="char-counter text-muted" id="seo_title_counter"
                                                                    style="position:absolute;right:10px;bottom:-20px;">70/70</small>
                                                            </div>
                                                            <div class="form-group position-relative">
                                                                <label for="seo_desc" class="form-label">SEO Description</label>
                                                                <input type="text" class="form-control mb-1"
                                                                    placeholder="SEO Description" name="seo_desc" id="seo_desc"
                                                                    maxlength="120">
                                                                <small class="char-counter text-muted" id="seo_desc_counter"
                                                                    style="position:absolute;right:10px;bottom:-20px;">160/160</small>
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="seo_img" class="form-label">SEO Image <small
                                                                        class="text-gray-400" style="font-size: 12px">(Max 2MB,
                                                                        JPEG/PNG/JPG/GIF/SVG, Dimensions: 1000x1000px)</small></label>
                                                                <div class="mb-2">
                                                                    <div id="seo_img_preview_container"
                                                                        class="position-relative d-inline-block">
                                                                    </div>
                                                                </div>
                                                                <input type="file" class="form-control" name="seo_img"
                                                                    id="seo_img" accept=".jpeg,.png,.jpg,.gif,.svg">
                                                                <div id="seo-image-upload-info" class="text-info mt-2"
                                                                    style="font-size: 12px;">
                                                                    <i class="fas fa-info-circle"></i>
                                                                    Please select image files (JPEG/PNG/JPG/GIF/SVG) only. Maximum file
                                                                    size: 2MB. Dimensions: 1000x1000px.
                                                                </div>
                                                                <div id="seo-file-size-warning" class="text-warning mt-2"
                                                                    style="display: none;">
                                                                    <i class="fas fa-exclamation-triangle"></i>
                                                                    <span id="seo-file-size-message"></span>
                                                                </div>
                                                                <div id="seo-image-success-message" class="text-success mt-2"
                                                                    style="display: none;">
                                                                    <i class="fas fa-check-circle"></i>
                                                                    SEO image added successfully!
                                                                </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <label for="seo_index" class="form-label">SEO Index</label>
                                                                <select class="form-control" name="seo_index" id="seo_index">
                                                                    <option value="1">Index</option>
                                                                    <option value="0">No Index</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <input type="hidden" name="status" value="selling">
                                                <div id="video-section">
                                                    <div class="form-group mt-3">
                                                        <label for="video_url" class="form-label">Video URL</label>
                                                        <input type="url" class="form-control" id="video_url"
                                                            name="video_url" placeholder="https://youtu.be/xxxx">
                                                        <small class="form-text text-muted">
                                                            Use the YouTube video link to be able to watch the video directly on the
                                                            website.
                                                        </small>
                                                    </div>
                                                    <div class="form-group mt-3">
                                                        <label for="video_thumbnail" class="form-label">Video Thumbnail <small
                                                                class="text-gray-400" style="font-size: 12px">(Max 2MB,
                                                                JPEG/PNG/JPG/GIF/SVG, Dimensions: 1280x720px)</small> <span
                                                                id="thumbnail-count">(0/250)</span></label>
                                                        <div class="mb-2">
                                                            <div id="video_thumbnail_preview_container"
                                                                class="position-relative d-inline-block">
                                                            </div>
                                                        </div>
                                                        <input type="file" class="form-control" id="video_thumbnail"
                                                            name="video_thumbnail" accept=".jpeg,.png,.jpg,.gif,.svg">
                                                        <div id="video-thumbnail-upload-info" class="text-info mt-2"
                                                            style="font-size: 12px;">
                                                            <i class="fas fa-info-circle"></i>
                                                            Please select image files (JPEG/PNG/JPG/GIF/SVG) only. Maximum file size:
                                                            2MB. Dimensions: 1280x720px.
                                                        </div>
                                                        <div id="video-thumbnail-file-size-warning" class="text-warning mt-2"
                                                            style="display: none;">
                                                            <i class="fas fa-exclamation-triangle"></i>
                                                            <span id="video-thumbnail-file-size-message"></span>
                                                        </div>
                                                        <div id="video-thumbnail-success-message" class="text-success mt-2"
                                                            style="display: none;">
                                                            <i class="fas fa-check-circle"></i>
                                                            Video thumbnail added successfully!
                                                        </div>
                                                        <small class="form-text text-muted">
                                                            If you use the YouTube video link above, the thumbnail will be automatically
                                                            obtained.
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="mt-3">
                                                <button type="button" class="btn btn-secondary" id="prevBtn"
                                                    style="display:none">Previous
                                                </button>
                                                <button type="button" class="btn btn-primary float-end" id="nextBtn">Next
                                                </button>
                                                <button type="submit" id="submitBtn" class="btn btn-success float-end"
                                                    style="display:none">
                                                    Submit
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
@endsection

@section('scripts')
    <style>
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        input[type="number"] {
            -moz-appearance: textfield;
        }

        input[type="number"]:focus {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        input[type="number"] {
            -webkit-appearance: none;
            -moz-appearance: textfield;
            appearance: textfield;
        }

        .form-check-input {
            pointer-events: auto !important;
            position: relative;
            z-index: 10;
        }
    </style>    

    <script src="https://cdn.ckeditor.com/ckeditor5/39.0.0/classic/ckeditor.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/@yaireo/tagify"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            PropertyForm.init();
        });

        const PropertyForm = {
            init() {
                this.cache();
                this.bindEvents();
                this.runInitial();
            },

            cache() {
                this.propertyForRadios = document.querySelectorAll('input[name="property_for"]');
                this.mainTypeRadios = document.querySelectorAll('input[name="property_main_type"]');
                this.propertyTypeWrapper = document.getElementById('property-type-wrapper');
                this.subtypeInput = document.getElementById('property_subtype');
                this.categoryInput = document.getElementById('category_id');
            },

            bindEvents() {
                this.propertyForRadios.forEach(r =>
                    r.addEventListener('change', () => {
                        this.updateOwnerLogic();
                        this.updateCommercialButtons();
                    })
                );

                this.mainTypeRadios.forEach(r =>
                    r.addEventListener('change', () => {
                        this.toggleMainType();
                        this.resetSubtype();
                    })
                );

                document.querySelectorAll('input[name="rent_lease_type"]').forEach(r =>
                    r.addEventListener('change', step2_updateRentLeaseType)
                );
            },

            runInitial() {
                this.updateOwnerLogic();
                this.toggleMainType();
                step2_updateRentLeaseType();
            },

            updateOwnerLogic() {
                if (typeof updateFormLogic === 'function') {
                    updateFormLogic();
                }
            },

            toggleMainType() {
                const mainType =
                    document.querySelector('input[name="property_main_type"]:checked')?.value || 'residential';
                const propertyFor =
                    document.querySelector('input[name="property_for"]:checked')?.value || 'sell';

                document.querySelectorAll('.res-type').forEach(b =>
                    b.classList.toggle('d-none', mainType !== 'residential')
                );
                document.querySelectorAll('.com-type').forEach(b =>
                    b.classList.toggle('d-none', mainType !== 'commercial')
                );

                const btnPlot = document.getElementById('btn-plot');
                if (btnPlot) {
                    btnPlot.classList.toggle('d-none', !(mainType === 'residential' && propertyFor === 'sell'));
                }

                if (mainType === 'commercial') this.updateCommercialButtons();
            },

            updateCommercialButtons() {
                document.getElementById('btn-plot')?.classList.add('d-none');
                document.getElementById('btn-land')?.classList.remove('d-none');
                document.getElementById('btn-land-lease')?.classList.add('d-none');
            },

            resetSubtype() {
                this.subtypeInput.value = '';
                this.categoryInput.value = '';
                document.querySelectorAll('.dynamic-group').forEach(g => g.classList.add('d-none'));
            },

            showDynamicFields(subtype) {

                document.querySelectorAll('.dynamic-group').forEach(g => g.classList.add('d-none'));

                const structure = document.getElementById('field-group-structure');
                const apartment = document.getElementById('field-group-apartment');
                const plot = document.getElementById('field-group-plot');

                if (['plot', 'land', 'land_lease'].includes(subtype)) {
                    plot?.classList.remove('d-none');
                } else if (subtype === 'apartment' || subtype === 'shop') {
                    structure?.classList.remove('d-none');
                    apartment?.classList.remove('d-none');
                } else {
                    structure?.classList.remove('d-none');
                }

                if (typeof toggleBedBathFields === 'function') toggleBedBathFields();
            }
        };

        function masterFinancialController() {
            const propertyFor = document.querySelector('input[name="property_for"]:checked')?.value || 'sell';
            const rentLeaseType = document.querySelector('input[name="rent_lease_type"]:checked')?.value || 'rent';
            const priceLabel = document.getElementById('price_label');
            const rentLeaseToggle = document.getElementById('rent_lease_toggle_section');
            const securitySec = document.getElementById('security_deposit_section');
            const maintenanceSec = document.getElementById('maintenance_section');
            const noticeSec = document.getElementById('notice_period_section');
            const leaseFields = document.getElementById('lease_specific_fields');
            [securitySec, maintenanceSec, noticeSec, leaseFields].forEach(el => {
                if (el) el.style.setProperty('display', 'none', 'important');
            });

            const tenantWrapper = document.getElementById('tenant_preference_wrapper');
            if (tenantWrapper) tenantWrapper.style.setProperty('display', propertyFor === 'sell' ? 'none' : '', 'important');

            if (propertyFor === 'sell') {
                if (priceLabel) priceLabel.innerHTML = 'Price <span class="text-danger">*</span>';
                if (rentLeaseToggle) rentLeaseToggle.style.display = 'none';
            } else {
                if (rentLeaseToggle) rentLeaseToggle.style.display = 'block';
                if (rentLeaseType === 'rent') {
                    if (priceLabel) priceLabel.innerHTML = 'Rent Amount <span class="text-danger">*</span>';
                    if (securitySec) securitySec.style.setProperty('display', 'flex', 'important');
                    if (maintenanceSec) maintenanceSec.style.setProperty('display', 'flex', 'important');
                    if (noticeSec) noticeSec.style.setProperty('display', 'block', 'important');
                } else {
                    if (priceLabel) priceLabel.innerHTML = 'Lease Amount <span class="text-danger">*</span>';
                    if (leaseFields) leaseFields.style.setProperty('display', 'block', 'important');
                    if (noticeSec) noticeSec.style.setProperty('display', 'block', 'important');
                }
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('input[name="property_for"]').forEach(radio => {
                radio.addEventListener('change', masterFinancialController);
            });

            document.querySelectorAll('input[name="rent_lease_type"]').forEach(radio => {
                radio.addEventListener('change', masterFinancialController);
            });

            masterFinancialController();
        });

        function updateFormLogic() {
            const propertyFor = document.querySelector('input[name="property_for"]:checked')?.value || 'sell';

            let effectivePropertyFor = propertyFor;
            if (propertyFor === 'rent_lease') {
                const rentLeaseType = document.querySelector('input[name="rent_lease_type"]:checked')?.value;
                if (rentLeaseType) effectivePropertyFor = rentLeaseType;
            }

            const rentLeaseSection = document.getElementById('rent_lease_toggle_section');
            const rentLeaseRadios = document.querySelectorAll('input[name="rent_lease_type"]');

            if (rentLeaseSection) {
                if (propertyFor === 'rent_lease') {
                    rentLeaseSection.style.setProperty('display', 'block', 'important');
                    rentLeaseRadios.forEach(radio => radio.setAttribute('required', 'required'));
                } else {
                    rentLeaseSection.style.setProperty('display', 'none', 'important');
                    rentLeaseRadios.forEach(radio => {
                        radio.removeAttribute('required');
                        radio.checked = false;
                    });
                }
            }

            const hasOwnerCredit = parseInt(document.getElementById('credit_owner')?.value || 0) > 0;
            const hasBuilderCredit = parseInt(document.getElementById('credit_builder')?.value || 0) > 0;
            const hasConsultantCredit = parseInt(document.getElementById('credit_consultant')?.value || 0) > 0;
            const hasAnySellCredit = hasOwnerCredit || hasBuilderCredit || hasConsultantCredit;
            const warningMsg = document.getElementById('package_warning_msg');
            const ownerButtonsWrapper = document.getElementById('owner_buttons_wrapper');
            const nextBtn = document.getElementById('nextBtn');
            const ownerOption = document.querySelector('#owner_owner')?.closest('.form-check-inline');
            const builderOption = document.querySelector('#owner_builder')?.closest('.form-check-inline');
            const consultantOption = document.querySelector('#owner_consultant')?.closest('.form-check-inline');

            if (propertyFor === 'sell') {
                if (!hasAnySellCredit) {
                    if (warningMsg) {
                        warningMsg.innerHTML =
                            "No active package is found. <a href='{{ route('dashboard.section', ['type' => 'credits']) }}'>Click here to post a property</a>";
                        warningMsg.style.display = 'block';
                    }
                    if (nextBtn) nextBtn.disabled = true;
                    [ownerOption, builderOption, consultantOption].forEach(el => el && (el.style.display = 'none'));
                } else {
                    if (warningMsg) warningMsg.style.display = 'none';
                    if (nextBtn) nextBtn.disabled = false;
                    if (ownerOption) ownerOption.style.display = hasOwnerCredit ? 'inline-flex' : 'none';
                    if (builderOption) builderOption.style.display = hasBuilderCredit ? 'inline-flex' : 'none';
                    if (consultantOption) consultantOption.style.display = hasConsultantCredit ? 'inline-flex' : 'none';
                }
            } else {
                if (warningMsg) warningMsg.style.display = 'none';
                if (nextBtn) nextBtn.disabled = false;
                if (ownerOption) ownerOption.style.display = 'inline-flex';
                if (builderOption) builderOption.style.display = 'none';
                if (consultantOption) consultantOption.style.display = 'inline-flex';
            }

            const priceLabel = document.getElementById('price_label');
            const leaseFields = document.getElementById('lease_specific_fields');
            if (effectivePropertyFor === 'lease') {
                if (priceLabel) priceLabel.innerHTML = 'Lease Amount <span class="text-danger">*</span>';
                if (leaseFields) leaseFields.style.display = 'block';
            } else if (effectivePropertyFor === 'rent') {
                if (priceLabel) priceLabel.innerHTML = 'Rent Amount <span class="text-danger">*</span>';
                if (leaseFields) leaseFields.style.display = 'none';
            } else {
                if (priceLabel) priceLabel.innerHTML = 'Price <span class="text-danger">*</span>';
                if (leaseFields) leaseFields.style.display = 'none';
            }

            updateCommercialButtonsVisibility();
        }

        function applyFinalCommercialRules(subtype) {

            const structureGroup = document.getElementById('field-group-structure');
            const floorGroup = document.getElementById('field-group-apartment');
            const storageInput = document.querySelector('[name="storage_area"]');

            if (!structureGroup || !floorGroup) return;

            const bedSec = document.getElementById('bedrooms-section');
            const bathSec = document.getElementById('bathrooms-section');
            const bedroomsInp = document.getElementById('bedrooms');
            const bathroomsInp = document.getElementById('bathrooms');
            if (bedSec) bedSec.style.setProperty('display', 'none', 'important');
            if (bathSec) bathSec.style.setProperty('display', 'none', 'important');
            if (bedroomsInp) bedroomsInp.removeAttribute('required');
            if (bathroomsInp) bathroomsInp.removeAttribute('required');

            ['house_type', 'construction_age', 'furnishing_type', 'water_supply', 'food_preference'].forEach(name => {
                const el = document.querySelector(`[name="${name}"]`);
                if (el) el.closest('.col-md-4, .col-md-6')?.style.setProperty('display', 'none', 'important');
            });

            structureGroup.classList.add('d-none');
            floorGroup.classList.add('d-none');

            const builtUp = document.getElementById('input_builtup_area');
            const totalFlr = document.getElementById('input_total_floors');
            const propFlr = document.getElementById('input_property_on_floor');

            [builtUp, totalFlr, propFlr].forEach(el => {
                if (el) el.removeAttribute('required');
            });

            if (storageInput) {
                const col = storageInput.closest('.col-md-6');
                if (col) col.classList.add('d-none');
                storageInput.removeAttribute('required');
                storageInput.value = '';
            }

            const floorTypes = [
                'shop',
                'building',
                'office_space',
                'godown',
                'warehouse'
            ];

            if (floorTypes.includes(subtype)) {

                structureGroup.classList.remove('d-none');
                if (builtUp) builtUp.setAttribute('required', 'required');

                floorGroup.classList.remove('d-none');
            }

            if (subtype === 'shop') {
                if (bathSec) bathSec.style.setProperty('display', 'block', 'important');
                if (bathroomsInp) bathroomsInp.removeAttribute('required');
            }

            if (storageInput && (subtype === 'godown' || subtype === 'warehouse')) {
                const col = storageInput.closest('.col-md-6');
                if (col) col.classList.remove('d-none');
                storageInput.setAttribute('required', 'required');
            }

            switchTenantPreferences(subtype);
        }

        function restoreResidentialFields(subtype) {
            [
                'house_type',
                'construction_age',
                'furnishing_type',
                'water_supply',
                'food_preference'
            ].forEach(name => {
                const el = document.querySelector(`[name="${name}"]`);
                if (el) {
                    const col = el.closest('.col-md-4, .col-md-6');
                    if (col) col.style.setProperty('display', '', '');
                }
            });

            ['balcony', 'pet_policy', 'garden', 'swimming_pool'].forEach(name => {
                document.querySelectorAll(`[name="${name}"]`).forEach(el => {
                    const col = el.closest('.col-md-4, .col-md-6, .col-md-12');
                    if (col) col.style.setProperty('display', '', '');
                });
            });

            ['bedrooms-section', 'bathrooms-section'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.setProperty('display', '', '');
            });

            const parkingCard = document.getElementById('parking_card');
            if (parkingCard) parkingCard.style.setProperty('display', '', '');

            document.querySelectorAll('[name="parking_availability"]').forEach(el => {
                const col = el.closest('.col-md-4, .col-md-6, .col-md-12');
                if (col) col.style.setProperty('display', '', '');
            });

            // Restore parking type/slots if parking_availability is already Yes
            const parkingYesChecked = document.querySelector('input[name="parking_availability"]:checked');
            const typeDiv = document.getElementById('parking_type_div');
            const slotsWrapper = document.getElementById('parking_slots_wrapper');
            if (typeDiv) typeDiv.style.setProperty('display', (parkingYesChecked && parkingYesChecked.value === 'Yes') ? 'block' : 'none', 'important');
            if (slotsWrapper) slotsWrapper.style.setProperty('display', (parkingYesChecked && parkingYesChecked.value === 'Yes') ? 'block' : 'none', 'important');

            const resGroup = document.getElementById('residential_tenant_prefs');
            const commGroup = document.getElementById('commercial_tenant_prefs');
            if (resGroup) resGroup.style.display = 'block';
            if (commGroup) commGroup.style.display = 'none';

            const ownershipWrapper = document.getElementById('ownership_wrapper');
            if (ownershipWrapper) {
                ownershipWrapper.style.setProperty('display', '', 'important');
                const companyOwnedOpt = ownershipWrapper.querySelector('option[value="Company Owned"]');
                if (companyOwnedOpt) companyOwnedOpt.style.display = 'none';
                const sel = ownershipWrapper.querySelector('select');
                if (sel && sel.value === 'Company Owned') sel.value = '';
            }

            [
                'corner_property_wrapper',
                'compound_wall_wrapper',
                'property_suitable_for_wrapper',
                'utility_area_wrapper',
                'loading_unloading_wrapper',
                'pantry_area_wrapper',
                'key_specifications_wrapper'
            ].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.setProperty('display', 'none', 'important');
            });

            const villaFields = document.getElementById('villa-specific-fields');
            if (villaFields) {
                if (subtype === 'villa' || subtype === 'individual_house') {
                    villaFields.style.display = 'block';
                } else {
                    villaFields.style.display = 'none';
                }
            }

            const balconyWrapper = document.getElementById('balcony_wrapper');
            if (balconyWrapper) balconyWrapper.style.setProperty('display', '', '');
        }

        document.addEventListener('DOMContentLoaded', function() {

            const wrapper = document.getElementById('property-type-wrapper');
            if (!wrapper) return;

            wrapper.addEventListener('click', function(e) {
                const btn = e.target.closest('button');
                if (!btn) return;

                const subtype = btn.getAttribute('data-type');

                setTimeout(() => {

                    if (['apartment', 'villa', 'individual_house'].includes(subtype)) {
                        restoreResidentialFields(subtype);
                        return;
                    }

                    applyFinalCommercialRules(subtype);

                }, 0);

            });

        });

        document.addEventListener('DOMContentLoaded', function() {

            let lastSubtype = null;

            const wrapper = document.getElementById('property-type-wrapper');
            if (wrapper) {
                wrapper.addEventListener('click', function(e) {
                    const btn = e.target.closest('button');
                    if (btn) {
                        lastSubtype = btn.getAttribute('data-type');
                    }
                });
            }

            document.querySelectorAll('input[name="owner_type"]').forEach(radio => {
                radio.addEventListener('change', function() {

                    if (!lastSubtype) return;

                    if (['apartment', 'villa', 'individual_house'].includes(lastSubtype)) {
                        setTimeout(() => {
                            applyResidentialSafeState(lastSubtype);
                        }, 0);
                    }
                });
            });

        });

        function applyResidentialSafeState(subtype) {

            const plotGroup = document.getElementById('field-group-plot');
            const structureGroup = document.getElementById('field-group-structure');
            const floorGroup = document.getElementById('field-group-apartment');

            if (!plotGroup || !structureGroup || !floorGroup) return;

            plotGroup.classList.add('d-none');
            structureGroup.classList.add('d-none');
            floorGroup.classList.add('d-none');

            if (subtype === 'apartment') {
                structureGroup.classList.remove('d-none');
                floorGroup.classList.remove('d-none');
                return;
            }

            if (subtype === 'villa' || subtype === 'individual_house') {
                plotGroup.classList.remove('d-none');
                structureGroup.classList.remove('d-none');
            }

            const resGroup = document.getElementById('residential_tenant_prefs');
            const commGroup = document.getElementById('commercial_tenant_prefs');
            if (resGroup) resGroup.style.display = 'block';
            if (commGroup) commGroup.style.display = 'none';
        }

        function updateStep2Visibility(subtype) {

            const show = id => document.getElementById(id)?.classList.remove('d-none');
            const hide = id => document.getElementById(id)?.classList.add('d-none');

            [
                'corner_property_wrapper',
                'compound_wall_wrapper',
                'property_suitable_for_wrapper',
                'utility_area_wrapper',
                'loading_unloading_wrapper',
                'pantry_area_wrapper',
                'key_specifications_wrapper'
            ].forEach(hide);

            if (['plot', 'land', 'land_lease'].includes(subtype)) {
                show('corner_property_wrapper');
                show('compound_wall_wrapper');
                return;
            }

            if (subtype === 'shop') {
                hide('bedrooms-section');
                const bathSec = document.getElementById('bathrooms-section');
                if (bathSec) bathSec.style.setProperty('display', 'block', 'important');
                show('corner_property_wrapper');
                show('property_suitable_for_wrapper');
                show('utility_area_wrapper');
                show('loading_unloading_wrapper');
                show('key_specifications_wrapper');
                const loadingReq = document.getElementById('loading_unloading_required');
                if (loadingReq) loadingReq.style.display = 'none';
                return;
            }

            if (subtype === 'building') {
                show('corner_property_wrapper');
                show('property_suitable_for_wrapper');
                show('utility_area_wrapper');
                show('key_specifications_wrapper');
                return;
            }

            if (subtype === 'godown' || subtype === 'warehouse') {
                show('corner_property_wrapper');
                show('property_suitable_for_wrapper');
                show('utility_area_wrapper');
                show('loading_unloading_wrapper');
                show('key_specifications_wrapper');
                const loadingReq = document.getElementById('loading_unloading_required');
                if (loadingReq) loadingReq.style.display = 'inline';
                return;
            }

            if (subtype === 'office_space') {
                show('property_suitable_for_wrapper');
                show('pantry_area_wrapper');
                show('key_specifications_wrapper');
            }
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            initFormLogic();
        });

        function initFormLogic() {
            setupPropertyTypeButtons();
            const mainTypeRadios = document.querySelectorAll('input[name="property_main_type"]');
            mainTypeRadios.forEach(radio => radio.addEventListener('change', updateMainTypeVisibility));

            document.querySelectorAll('input[name="property_for"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    updateFormLogic();
                    updateMainTypeVisibility();
                });
            });

            document.querySelectorAll('input[name="rent_lease_type"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    updateFormLogic();
                });
            });

            document.querySelectorAll('input[name="owner_type"]').forEach(radio => {
                radio.addEventListener('change', updateFormLogic);
            });

            const prevBtn = document.getElementById('prevBtn');
            if (prevBtn) {
                prevBtn.addEventListener('click', function() {
                    setTimeout(updateFormLogic, 100);
                });
            }

            updateFormLogic();
            updateMainTypeVisibility();

            if (typeof updateCommercialButtonsVisibility === 'function') {
                updateCommercialButtonsVisibility();
            }
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

                    handleSubtypeChange(subtype);
                    
                    console.log('About to call direction facing with catId:', catId);
                    if (typeof toggleDirectionFacingRequirementWithValue === 'function') {
                        toggleDirectionFacingRequirementWithValue(catId);
                    }
                }
            });
        }

        function handleSubtypeChange(subtype) {
            console.log("Subtype Changed to:", subtype);

            document.querySelectorAll('.dynamic-group').forEach(el => el.classList.add('d-none'));

            // Always reset storage area when switching subtypes;
            // applyFinalCommercialRules will re-show it only for godown/warehouse.
            const storageWrapper = document.getElementById('storage_area_wrapper');
            if (storageWrapper) {
                storageWrapper.classList.add('d-none');
                const storageInput = document.getElementById('input_storage_area');
                if (storageInput) {
                    storageInput.removeAttribute('required');
                    storageInput.value = '';
                }
            }

            const villaFields = document.getElementById('villa-specific-fields');
            if (villaFields) villaFields.style.display = 'none';

            const inputPlot = document.getElementById('input_plot_area');
            const inputBuilt = document.getElementById('input_builtup_area');
            const inputTotalFloors = document.getElementById('input_total_floors');
            const inputPropFloor = document.getElementById('input_property_on_floor');
            const colCarpetArea = document.getElementById('col_carpet_area');
            const colCarpetUnit = document.getElementById('col_carpet_unit');
            const labelPlotArea = document.getElementById('label_plot_area');
            const additionalDetailsRow = document.getElementById('plot-additional-details');
            const plotDetailsTitle = document.getElementById('plot-details-title');

            [inputPlot, inputBuilt, inputTotalFloors, inputPropFloor].forEach(el => el && el.removeAttribute('required'));

            // Reset floor asterisks — re-shown only for Apartment below
            const totalFloorsAsterisk = document.getElementById('total_floors_asterisk');
            const propFloorAsterisk = document.getElementById('property_on_floor_asterisk');
            if (totalFloorsAsterisk) totalFloorsAsterisk.style.display = 'none';
            if (propFloorAsterisk) propFloorAsterisk.style.display = 'none';

            if (colCarpetArea) colCarpetArea.style.display = 'block';
            if (colCarpetUnit) colCarpetUnit.style.display = 'block';
            if (additionalDetailsRow) additionalDetailsRow.style.display = 'none';
            if (plotDetailsTitle) plotDetailsTitle.style.display = 'block';

            if (['plot', 'land', 'land_lease'].includes(subtype)) {
                document.getElementById('field-group-plot')?.classList.remove('d-none');
                if (inputPlot) inputPlot.setAttribute('required', 'required');

                if (additionalDetailsRow) additionalDetailsRow.style.display = 'flex';
                
                if (subtype === 'plot') {
                    if (plotDetailsTitle) plotDetailsTitle.textContent = 'Plot Details';
                    if (labelPlotArea) labelPlotArea.innerHTML = 'Plot Area <span class="text-danger">*</span>';
                } else {
                    if (plotDetailsTitle) plotDetailsTitle.textContent = 'Land Details';
                    if (labelPlotArea) labelPlotArea.innerHTML = 'Land Area <span class="text-danger">*</span>';
                }
            }
            
            else if (subtype === 'apartment' || subtype === 'shop') {
                document.getElementById('field-group-structure')?.classList.remove('d-none');
                document.getElementById('field-group-apartment')?.classList.remove('d-none');
                if (inputBuilt) inputBuilt.setAttribute('required', 'required');
                if (subtype === 'apartment') {
                    if (inputTotalFloors) inputTotalFloors.setAttribute('required', 'required');
                    if (inputPropFloor) inputPropFloor.setAttribute('required', 'required');
                    if (totalFloorsAsterisk) totalFloorsAsterisk.style.display = 'inline';
                    if (propFloorAsterisk) propFloorAsterisk.style.display = 'inline';
                }
                if (subtype === 'apartment' && colCarpetArea) colCarpetArea.style.display = 'none';
            }

            else if (subtype === 'building') {
                document.getElementById('field-group-structure')?.classList.remove('d-none');
                document.getElementById('field-group-apartment')?.classList.remove('d-none');
                if (inputBuilt) inputBuilt.setAttribute('required', 'required');
                if (inputTotalFloors) inputTotalFloors.setAttribute('required', 'required');
                if (inputPropFloor) inputPropFloor.setAttribute('required', 'required');
                if (totalFloorsAsterisk) totalFloorsAsterisk.style.display = 'inline';
                if (propFloorAsterisk) propFloorAsterisk.style.display = 'inline';
            }
            
            else if (['villa', 'individual_house'].includes(subtype)) {
                document.getElementById('field-group-plot')?.classList.remove('d-none');
                document.getElementById('field-group-structure')?.classList.remove('d-none');
                if (plotDetailsTitle) plotDetailsTitle.textContent = 'Land Details';
                if (labelPlotArea) labelPlotArea.innerHTML = 'Land Area <span class="text-danger">*</span>';
                if (additionalDetailsRow) additionalDetailsRow.style.display = 'none';
                if (villaFields) villaFields.style.display = 'block';
                if (inputPlot) inputPlot.setAttribute('required', 'required');
                if (inputBuilt) inputBuilt.setAttribute('required', 'required');
            }
            
            else {
                document.getElementById('field-group-structure')?.classList.remove('d-none');
                if (inputBuilt) inputBuilt.setAttribute('required', 'required');
            }

            if (typeof toggleBedBathFields === 'function') toggleBedBathFields();
            if (typeof updateStep2Visibility === 'function') updateStep2Visibility(subtype);
        }

        const propertyFor = document.querySelector('input[name="property_for"]:checked')?.value;
        const rentLeaseSection = document.getElementById('rent_lease_toggle_section');

        if (rentLeaseSection) {
            if (propertyFor === 'sell') {
                rentLeaseSection.style.setProperty('display', 'none', 'important');
                document.querySelectorAll('input[name="rent_lease_type"]').forEach(radio => {
                    radio.removeAttribute('required');
                });
            } else {
                rentLeaseSection.style.setProperty('display', 'block', 'important');
                document.querySelectorAll('input[name="rent_lease_type"]').forEach(radio => {
                    radio.setAttribute('required', 'required');
                });
            }
        }

        function toggleMaintenance(show) {
            const amountInput = document.getElementById('maintenance_amount_input');
            const wordsDiv = document.getElementById('maintenance_words_div');
            const wordInput = document.getElementById('maintenance_charge_words_input');

            if (show) {
                amountInput.style.display = 'block';
                amountInput.setAttribute('required', 'required');
                if (wordsDiv) wordsDiv.style.display = 'block';
            } else {
                amountInput.style.display = 'none';
                amountInput.removeAttribute('required');
                amountInput.value = '';
                if (wordsDiv) wordsDiv.style.display = 'none';
                if (wordInput) wordInput.value = '';
            }
        }

        function toggleAvailabilityDate() {
            const status = document.getElementById('availability_status').value;
            const dateInput = document.getElementById('availability_date');
            if (status === 'Available From') {
                dateInput.style.display = 'block';
                dateInput.setAttribute('required', 'required');
            } else {
                dateInput.style.display = 'none';
                dateInput.removeAttribute('required');
            }
        }

        function convertPriceToText(value, outputId) {
            const outputElement = document.getElementById(outputId);
            if (!value) {
                if (outputElement) outputElement.value = '';
                return;
            }
            const numericValue = value.replace(/,/g, '');
            if (isNaN(numericValue)) {
                if (outputElement) outputElement.value = '';
                return;
            }
            const words = convertNumberToWords(numericValue);
            if (outputElement) outputElement.value = words;
        }

        const permalinkInput = document.getElementById('permalink');
        const permalinkPreview = document.getElementById('permalink-preview');
        const nameInput = document.getElementById('name');
        let debounceTimer;
        window.permalinkIsValid = null;

        function checkPermalinkUniqueness(slugToCheck) {
            if (!permalinkInput) return;
            if (!slugToCheck.trim()) {
                clearPermalinkFeedback();
                return;
            }

            fetch('{{ route('check.slug.unique') }}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: JSON.stringify({
                        permalink: slugToCheck,
                        property_id: 'null'
                    })
                })
                .then(response => response.json())
                .then(data => {
                    const container = document.getElementById('permalink-section');
                    let feedbackDiv = document.getElementById('permalink-feedback');

                    if (!feedbackDiv && container) {
                        feedbackDiv = document.createElement('div');
                        feedbackDiv.id = 'permalink-feedback';
                        container.appendChild(feedbackDiv);
                    }

                    if (feedbackDiv) {
                        if (data.unique) {
                            feedbackDiv.className = 'text-success mt-1';
                            feedbackDiv.textContent = 'Permalink is unique and available!';
                            permalinkInput.classList.remove('is-invalid');
                            permalinkInput.classList.add('is-valid');
                            window.permalinkIsValid = true;
                        } else {
                            feedbackDiv.className = 'text-danger mt-1';
                            feedbackDiv.innerHTML = `Permalink is not unique. Suggested: <strong>${data.suggested_slug}</strong>`;
                            permalinkInput.classList.remove('is-valid');
                            permalinkInput.classList.add('is-invalid');
                            window.permalinkIsValid = false; 
                        }
                    }
                })
                .catch(error => console.error('Error checking permalink:', error));
        }

        if (permalinkInput) {
            let isEdited = false;

            permalinkInput.addEventListener('input', function() {
                isEdited = true;
                const val = this.value;
                if (permalinkPreview) permalinkPreview.textContent = val;

                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => checkPermalinkUniqueness(val), 500);
            });

            if (nameInput) {
                nameInput.addEventListener('input', function() {
                    if (!isEdited || !permalinkInput.value) {
                        let slug = this.value.toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^a-z0-9\-]/g, '')
                            .replace(/\-+/g, '-');

                        permalinkInput.value = slug;
                        if (permalinkPreview) permalinkPreview.textContent = slug;
                        clearTimeout(debounceTimer);
                        debounceTimer = setTimeout(() => checkPermalinkUniqueness(slug), 500);
                    }
                });
            }
        }

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
                    if (!input.hasAttribute('min')) {
                        input.setAttribute('min', '0');
                    }

                    input.addEventListener('input', function(e) {
                        let value = this.value;
                        value = value.replace(/[-+e]/g, '');
                        if (parseFloat(value) < 0) value = '';
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
            const imageInput = document.getElementById('images');
            const imageLimitText = document.getElementById('image-limit-text');
            const imageLimitWarning = document.getElementById('image-limit-warning');
            const imageLimitMessage = document.getElementById('image-limit-message');
            const imageLimits = {
                'Owner': 15,
                'Builder': 15,
                'Consultant': 5
            };

            let currentImageLimit = 15; 

            function updateImageLimit() {
                updateImageLimitAndPreview();
            }

            function checkImageCount() {
                const currentCount = window.fileList ? window.fileList.length : 0;
                const imageCount = document.getElementById('image-count');
                if (imageCount) {
                    imageCount.textContent = currentCount;
                }

                if (currentCount > currentImageLimit) {
                    imageLimitWarning.style.display = 'block';
                    imageLimitMessage.textContent =
                        `You can only upload up to ${currentImageLimit} images. Please remove ${currentCount - currentImageLimit} image(s).`;
                    imageInput.classList.add('is-invalid');
                } else {
                    imageLimitWarning.style.display = 'none';
                    imageInput.classList.remove('is-invalid');
                }
            }

            document.querySelectorAll('input[name="owner_type"]').forEach(function(radio) {
                radio.addEventListener('change', updateImageLimit);
            });

            function updateImageLimitAndPreview() {
                const selected = document.querySelector('input[name="owner_type"]:checked');
                if (selected && imageLimits[selected.value]) {
                    currentImageLimit = imageLimits[selected.value];
                    window.currentImageLimit = currentImageLimit; 
                    imageLimitText.textContent = `Up to ${currentImageLimit} images`;
                    const imageLimitDisplay = document.getElementById('image-limit-display');
                    if (imageLimitDisplay) {
                        imageLimitDisplay.textContent = currentImageLimit;
                    }
                    
                    if (imageInput) {
                        imageInput.setAttribute('data-max-files', currentImageLimit);
                    }
                    
                    if (window.fileList && window.fileList.length > currentImageLimit) {
                        window.fileList = window.fileList.slice(0, currentImageLimit);
                        
                        imageLimitWarning.style.display = 'block';
                        imageLimitMessage.textContent =
                            `Image limit changed. Only the first ${currentImageLimit} images will be kept.`;
                        imageInput.classList.add('is-invalid');
                        
                        setTimeout(() => {
                            imageLimitWarning.style.display = 'none';
                            imageInput.classList.remove('is-invalid');
                        }, 3000);
                    }
                    
                    if (window.renderPreviews) {
                        window.renderPreviews();
                    }
                    checkImageCount();
                }
            }

            window.checkImageCount = checkImageCount;
            updateImageLimit();
            checkImageCount();
        });

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

        document.addEventListener('DOMContentLoaded', function() {
            function toggleVideoSection() {
                const selected = document.querySelector('input[name="owner_type"]:checked');
                const videoSection = document.getElementById('video-section');
                if (videoSection) {
                    if (selected && (selected.value === 'Owner' || selected.value === 'Builder')) {
                        videoSection.style.display = '';
                    } else {
                        videoSection.style.display = 'none';
                    }
                }
            }
            toggleVideoSection();
            document.querySelectorAll('input[name="owner_type"]').forEach(function(radio) {
                radio.addEventListener('change', toggleVideoSection);
            });
        });
 
        document.addEventListener('DOMContentLoaded', function() {
            function getSelectedCategory() {
                const checked = document.querySelector('input[name="category_id"]:checked');
                return checked ? parseInt(checked.value) : null;
            }

            function getCommercialType() {
                const commercialType = document.querySelector('input[name="custom_fields[select][value]"]:checked');
                return commercialType ? commercialType.value.toLowerCase() : null;
            }

            function togglePossessionStatus() {
                const category = getSelectedCategory();
                const commercialType = getCommercialType();
                console.log("my debug", category, commercialType);
                const section = document.getElementById('possession-status-section');
                if (!section) return;

                if ([1, 2, 4].includes(category)) {
                    section.style.display = '';
                    document.querySelectorAll('input[name="possession_status"]').forEach(radio => {
                        radio.setAttribute('required', 'required');
                    });
                    document.dispatchEvent(new Event('possessionStatusVisible'));
                } else if (category === 6 && (commercialType === 'shop' || commercialType === 'building')) {
                    section.style.display = '';
                    document.querySelectorAll('input[name="possession_status"]').forEach(radio => {
                        radio.setAttribute('required', 'required');
                    });
                    document.dispatchEvent(new Event('possessionStatusVisible'));
                } else {
                    section.style.display = 'none';
                    document.querySelectorAll('input[name="possession_status"]').forEach(radio => {
                        radio.removeAttribute('required');
                    });
                }
            }

            document.querySelectorAll('input[name="category_id"]').forEach(function(radio) {
                radio.addEventListener('change', function() {
                    setTimeout(togglePossessionStatus, 200);
                });
            });

            attachCommercialTypeListeners();
            togglePossessionStatus();

            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(togglePossessionStatus, 100);
            });

        });

        document.addEventListener('DOMContentLoaded', function() {
            function toggleBedBathFields() {
                const subtype = document.getElementById('property_subtype')?.value;
                const category = document.getElementById('category_id')?.value;
                const commercialType = document.querySelector('input[name="custom_fields[select][value]"]:checked')?.value;
                const bedroomsSection = document.getElementById('bedrooms-section');
                const bathroomsSection = document.getElementById('bathrooms-section');
                const bedroomsInput = document.getElementById('bedrooms');
                const bathroomsInput = document.getElementById('bathrooms');
                const bedroomsAsterisk = document.getElementById('bedrooms-asterisk');
                const bathroomsAsterisk = document.getElementById('bathrooms-asterisk');

                if (['1', '2', '4'].includes(category)) {
                    bedroomsSection.style.display = '';
                    bathroomsSection.style.display = '';
                    bedroomsInput.setAttribute('required', 'required');
                    bathroomsInput.setAttribute('required', 'required');
                    if (bedroomsAsterisk) bedroomsAsterisk.style.display = '';
                    if (bathroomsAsterisk) bathroomsAsterisk.style.display = '';
                }
                
                else if (subtype === 'shop' || subtype === 'building' || (category === '6' && commercialType && (commercialType.toLowerCase() === 'shop' || commercialType.toLowerCase() === 'building'))) {
                    bedroomsSection.style.setProperty('display', 'none', 'important');
                    bedroomsInput.removeAttribute('required');
                    if (bedroomsAsterisk) bedroomsAsterisk.style.display = 'none';
                    bathroomsSection.style.setProperty('display', 'block', 'important');
                    bathroomsInput.removeAttribute('required');
                    if (bathroomsAsterisk) bathroomsAsterisk.style.display = 'none';
                }
                
                else {
                    bedroomsSection.style.display = 'none';
                    bathroomsSection.style.display = 'none';
                    bedroomsInput.removeAttribute('required');
                    bathroomsInput.removeAttribute('required');
                    if (bedroomsAsterisk) bedroomsAsterisk.style.display = 'none';
                    if (bathroomsAsterisk) bathroomsAsterisk.style.display = 'none';
                }
            }

            document.querySelectorAll('input[name="category_id"]').forEach(function(radio) {
                radio.addEventListener('change', function() {
                    setTimeout(toggleBedBathFields, 200); 
                });
            });

            function attachCommercialTypeListeners() {
                document.querySelectorAll('input[name="custom_fields[select][value]"]').forEach(function(radio) {
                    radio.addEventListener('change', toggleBedBathFields);
                });
            }

            window.toggleBedBathFields = toggleBedBathFields;
            attachCommercialTypeListeners();
            toggleBedBathFields();
        });

        function toggleDirectionFacingRequirement() {
            const categoryId = document.getElementById('category_id')?.value;
            toggleDirectionFacingRequirementWithValue(categoryId);
        }

        function toggleDirectionFacingRequirementWithValue(categoryId) {
            const directionSelect = document.getElementById('direction_facing');
            const directionStar = document.getElementById('direction_facing_required_star');

            console.log('toggleDirectionFacingRequirement called');
            console.log('Category ID:', categoryId);
            console.log('Direction Star Element:', directionStar);

            if (!directionSelect) {
                console.log('Direction select not found - probably not on Step 4 yet');
                return;
            }

            if (categoryId === '3' || categoryId === 3) { 
                console.log('Plot selected - showing asterisk');
                directionSelect.setAttribute('required', 'required');
                if (directionStar) {
                    directionStar.classList.remove('d-none');
                    console.log('Asterisk classes after remove:', directionStar.className);
                }
            } else {
                console.log('Not a plot - hiding asterisk');
                directionSelect.removeAttribute('required');
                if (directionStar) {
                    directionStar.classList.add('d-none');
                    console.log('Asterisk classes after add:', directionStar.className);
                }
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            toggleDirectionFacingRequirement();
            document.querySelectorAll('input[name="category_id"]').forEach(function(radio) {
                radio.addEventListener('change', toggleDirectionFacingRequirement);
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            function ensurePermalinkAlwaysVisible() {
                const section = document.getElementById('permalink-section');
                const permalinkInput = document.getElementById('permalink');
                const nameInput = document.getElementById('name');

                if (section && permalinkInput) {
                    section.style.display = '';
                    permalinkInput.setAttribute('required', 'required');
                    const permalinkGroup = permalinkInput.closest('.form-group');
                    const noteDiv = permalinkGroup?.querySelector('#consultant-note');
                    if (noteDiv) noteDiv.remove();
                    if (nameInput && nameInput.value.trim() && !permalinkInput.value.trim()) {
                        let slug = nameInput.value
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^a-z0-9\-]/g, '')
                            .replace(/\-+/g, '-');
                        permalinkInput.value = slug;
                        const preview = document.getElementById('permalink-preview');
                        if (preview) preview.textContent = slug;
                    }
                }
            }

            ensurePermalinkAlwaysVisible();
            document.querySelectorAll('input[name="owner_type"]').forEach(function(radio) {
                radio.addEventListener('change', function() {
                    ensurePermalinkAlwaysVisible();
                    const nameInput = document.getElementById('name');
                    if (nameInput && nameInput.value.trim()) {
                        const permalinkInput = document.getElementById('permalink');
                        if (permalinkInput && !permalinkInput.value.trim()) {
                            let slug = nameInput.value
                                .toLowerCase()
                                .replace(/\s+/g, '-')
                                .replace(/[^a-z0-9\-]/g, '')
                                .replace(/\-+/g, '-');
                            permalinkInput.value = slug;
                            const preview = document.getElementById('permalink-preview');
                            if (preview) preview.textContent = slug;
                        }
                    }
                });
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            const nameInput = document.getElementById('name');
            const permalinkInput = document.getElementById('permalink');
            let permalinkEdited = false;
            permalinkInput.addEventListener('input', function() {
                permalinkEdited = true;
            });

            nameInput.addEventListener('input', function() {
                if (!permalinkEdited || !permalinkInput.value) {
                    let slug = nameInput.value
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9\-]/g, '')
                        .replace(/\-+/g, '-');
                    permalinkInput.value = slug;
                    document.getElementById('permalink-preview').textContent = slug;
                }
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            const permalinkInput = document.getElementById('permalink');
            const permalinkPreview = document.getElementById('permalink-preview');
            let debounceTimer;
            window.permalinkIsValid = null;

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

                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => {
                        checkPermalinkUniqueness(currentSlug);
                    }, 500);
                });
            }

            const nameInputForCheck = document.getElementById('name');
            if (nameInputForCheck) {
                nameInputForCheck.addEventListener('input', function() {
                    const currentSlug = permalinkInput.value;
                    if (currentSlug.trim()) {
                        clearTimeout(debounceTimer);
                        checkPermalinkUniqueness(currentSlug);
                    } else {
                        clearPermalinkFeedback();
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
            function toggleBrokerTypeAndFee() {
                const ownerType = document.querySelector('input[name="owner_type"]:checked');
                const brokerTypeContainer = document.getElementById('brokerTypeContainer');
                const brokerFeeContainer = document.getElementById('brokerFeeContainer');
                const brokerageTypeRadios = document.querySelectorAll('input[name="brokerage_type"]');
                const selectedBrokerageType = document.querySelector('input[name="brokerage_type"]:checked');


                if (ownerType && ownerType.value === 'Consultant') {
                    brokerTypeContainer.style.display = '';
                    brokerageTypeRadios.forEach(radio => radio.setAttribute('required', 'required'));
                    if (selectedBrokerageType && (selectedBrokerageType.value === 'fixed' || selectedBrokerageType
                            .value === 'percentage')) {
                        brokerFeeContainer.style.display = '';
                        document.getElementById('brokerage_fee').setAttribute('required', 'required');
                    } else {
                        brokerFeeContainer.style.display = 'none';
                        document.getElementById('brokerage_fee').removeAttribute('required');
                        document.getElementById('brokerage_fee').value = '';
                    }
                } else {
                    brokerTypeContainer.style.display = 'none';
                    brokerFeeContainer.style.display = 'none';
                    brokerageTypeRadios.forEach(radio => radio.removeAttribute('required'));
                    document.getElementById('brokerage_fee').removeAttribute('required');
                    document.getElementById('brokerage_fee').value = '';
                }

                if (selectedBrokerageType && selectedBrokerageType.value === 'percentage') {
                    brokerFeeContainer.style.display = '';
                    document.getElementById('brokerage_fee').setAttribute('required', 'required');
                    document.getElementById('brokerage_fee').placeholder = 'Enter percentage (e.g., 5)';
                    document.getElementById('brokerage_fee_label').innerHTML =
                        'Broker Fee (%) <span class="text-danger">*</span>';
                    document.getElementById('brokerage_fee').value = '';
                } else if (selectedBrokerageType && (selectedBrokerageType.value === 'fixed')) {
                    brokerFeeContainer.style.display = '';
                    document.getElementById('brokerage_fee').setAttribute('required', 'required');
                    document.getElementById('brokerage_fee').placeholder = 'Enter amount';
                    document.getElementById('brokerage_fee_label').innerHTML =
                        'Broker Fee <span class="text-danger">*</span>';
                    document.getElementById('brokerage_fee').value = '';
                } else {
                    brokerFeeContainer.style.display = 'none';
                    document.getElementById('brokerage_fee').removeAttribute('required');
                    document.getElementById('brokerage_fee').value = '';
                    document.getElementById('brokerage_fee').placeholder = 'Enter amount';
                    document.getElementById('brokerage_fee_label').innerHTML =
                        'Broker Fee <span class="text-danger">*</span>';
                }
            }

            document.querySelectorAll('input[name="owner_type"]').forEach(function(radio) {
                radio.addEventListener('change', toggleBrokerTypeAndFee);
            });

            document.querySelectorAll('input[name="brokerage_type"]').forEach(function(radio) {
                radio.addEventListener('change', toggleBrokerTypeAndFee);
            });

            toggleBrokerTypeAndFee();

            const brokerageFeeInput = document.getElementById('brokerage_fee');
            if (brokerageFeeInput) {
                brokerageFeeInput.addEventListener('input', function() {
                    const selectedBrokerageType = document.querySelector(
                        'input[name="brokerage_type"]:checked');

                    if (selectedBrokerageType && selectedBrokerageType.value === 'percentage') {
                        let value = this.value.replace(/[^\d]/g, '');
                        if (value.length > 1) {
                            value = value.slice(0, 1);
                        }

                        this.value = value;
                    } else {
                        let value = this.value.replace(/[^\d]/g, '');
                        if (value.includes('.')) {
                            value = parseFloat(value).toString();
                        }
                        if (value.length > 7) {
                            value = value.slice(0, 7);
                        }
                        if (value && value.length > 0) {
                            value = Number(value).toLocaleString('en-IN');
                        }

                        this.value = value;
                    }
                });
            }
        });

        let currentStep = 1;
        const totalSteps = 5;
        function validateFormInputs(step = null) {
            let valid = true;
            let firstInvalid = null;
            const container = step ? document.querySelector(`#step-${step}`) : document.getElementById('propertyForm');
            if (!container) return true;
            const requiredInputs = container.querySelectorAll(
                "input[required]:not([type='radio']):not([type='checkbox']), textarea[required]");
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    showError(input, "This field is required");
                    valid = false;
                    if (!firstInvalid) firstInvalid = input;
                } else {
                    clearError(input);
                }
            });

            const requiredSelects = container.querySelectorAll("select[required]");
            requiredSelects.forEach(select => {
                if (!select.value || select.value === "Select City" || select.value === "") {
                    showError(select, "Please select an option");
                    valid = false;
                    if (!firstInvalid) firstInvalid = select;
                } else {
                    clearError(select);
                }
            });

            const requiredRadios = container.querySelectorAll("input[type='radio'][required]");
            const radioGroups = new Set();
            requiredRadios.forEach(radio => radioGroups.add(radio.name));

            radioGroups.forEach(name => {
                const group = container.querySelectorAll(`input[type='radio'][name='${name}']`);
                const isChecked = Array.from(group).some(r => r.checked);
                const firstRadio = group[0];

                if (!isChecked) {
                    showError(firstRadio, `This field is required`);
                    valid = false;
                    if (!firstInvalid) firstInvalid = firstRadio;
                } else {
                    clearError(firstRadio);
                }
            });

            const requiredCheckboxes = container.querySelectorAll("input[type='checkbox'][required]");
            requiredCheckboxes.forEach(checkbox => {
                if (!checkbox.checked) {
                    showError(checkbox, "This checkbox must be checked");
                    valid = false;
                    if (!firstInvalid) firstInvalid = checkbox;
                } else {
                    clearError(checkbox);
                }
            });

            const requiredFiles = container.querySelectorAll("input[type='file'][required]");
            requiredFiles.forEach(fileInput => {
                if (!fileInput.files.length) {
                    showError(fileInput, "Please upload a file");
                    valid = false;
                    if (!firstInvalid) firstInvalid = fileInput;
                } else {
                    clearError(fileInput);
                }
            });

            const facilityRows = container.querySelectorAll('.facilities');
            facilityRows.forEach((row, index) => {
                const facilitySelect = row.querySelector('select[name="facilities[]"]');
                const facilityValue = row.querySelector('input[name="facility_values[]"]');
                if (facilitySelect && facilityValue) {
                    if (facilitySelect.value && facilitySelect.value !== "" && facilitySelect.value !==
                        "Select Facility") {
                        if (!facilityValue.value || facilityValue.value.trim() === "") {
                            showError(facilityValue, "Please enter a distance value for the selected facility");
                            valid = false;
                            if (!firstInvalid) firstInvalid = facilityValue;
                        } else {
                            clearError(facilityValue);
                        }
                    }

                    if (facilityValue.value && facilityValue.value.trim() !== "") {
                        if (!facilitySelect.value || facilitySelect.value === "" || facilitySelect.value ===
                            "Select Facility") {
                            showError(facilitySelect, "Please select a facility type");
                            valid = false;
                            if (!firstInvalid) firstInvalid = facilitySelect;
                        } else {
                            clearError(facilitySelect);
                        }
                    }
                }
            });

            if (!valid && firstInvalid) {
                firstInvalid.scrollIntoView({
                    behavior: "smooth"
                });
            }

            return valid;
        }

        function getRadioErrorElement(radioInput) {
            if (radioInput.type === 'radio') {
                let fieldset = radioInput.closest('fieldset') || radioInput.closest('.form-group');
                if (fieldset) {

                    return fieldset.querySelector(`input[type="radio"][name="${radioInput.name}"]`);
                }
            }
            return radioInput;
        }

        function showError(inputElement, message) {
            const name = inputElement.name;
            const safeId = name.replace(/\[|\]/g, '_').replace(/_+/g, '_').replace(/_$/, '');
            const errorContainerId = `${safeId}_error`;

            if (name === 'facilities[]' || name === 'facility_values[]') {
                const row = inputElement.closest('.facilities');
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

            if (name === 'facilities[]' || name === 'facility_values[]') {
                const row = inputElement.closest('.facilities');
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

        function validateCurrentStep() {
            return validateFormInputs(currentStep);
        }

        $('#nextBtn').off('click').on('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $('.is-invalid').removeClass('is-invalid');

            function triggerError(selector, message, isRadio = false) {
                alert(message);
                setTimeout(function() {
                    const $el = $(selector);
                    if ($el.length > 0) {
                        $el.addClass('is-invalid');
                        $el[0].scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                        if (!isRadio) $el.focus();
                    }
                }, 150);
            }

            if (currentStep === 1) {
                if ($('input[name="property_main_type"]:checked').length === 0) {
                    triggerError('input[name="property_main_type"]', "Please select Residential or Commercial.",
                        true);
                    return false;
                }
                if ($('#property_subtype').val() === "") {
                    triggerError('#property-type-wrapper', "Please select a Property Type.", true);
                    return false;
                }

                const propertySubtype = $('#property_subtype').val();
                const isVillaOrIndividualHouse = ['villa', 'individual_house'].includes(propertySubtype);
                const isPlotOrLand = ['plot', 'land'].includes(propertySubtype);

                if (isVillaOrIndividualHouse) {
                    if ($('#field-group-plot').is(':visible')) {
                        if ($('#input_plot_area').val().trim() === "") {
                            triggerError('#input_plot_area', "Please fill in the Land Area.");
                            return false;
                        }
                        const plotUnit = $('select[name="plot_unit"]');
                        if (plotUnit.val() === "") {
                            triggerError('select[name="plot_unit"]', "Please select the Unit for Land Area.");
                            return false;
                        }
                    }

                    if ($('#field-group-structure').is(':visible')) {
                        if ($('#input_builtup_area').val().trim() === "") {
                            triggerError('#input_builtup_area', "Please fill in the Built-up Area.");
                            return false;
                        }
                        const builtupUnit = $('select[name="builtup_unit"]');
                        if (builtupUnit.val() === "") {
                            triggerError('select[name="builtup_unit"]',
                            "Please select the Unit for Built-up Area.");
                            return false;
                        }
                    }
                } else if (isPlotOrLand) {
                    if ($('#field-group-plot').is(':visible')) {
                        var areaLabel = (propertySubtype === 'plot') ? 'Plot Area' : 'Land Area';
                        if ($('#input_plot_area').val().trim() === "") {
                            triggerError('#input_plot_area', "Please fill in the " + areaLabel + ".");
                            return false;
                        }
                        const plotUnit = $('select[name="plot_unit"]');
                        if (plotUnit.val() === "") {
                            triggerError('select[name="plot_unit"]', "Please select the Unit for " + areaLabel +
                                ".");
                            return false;
                        }
                    }
                } else {
                    if ($('#field-group-structure').is(':visible')) {
                        if ($('#input_builtup_area').val().trim() === "") {
                            triggerError('#input_builtup_area', "Please fill in the Built-up Area.");
                            return false;
                        }
                        const builtupUnit = $('select[name="builtup_unit"]');
                        if (builtupUnit.val() === "") {
                            triggerError('select[name="builtup_unit"]',
                            "Please select the Unit for Built-up Area.");
                            return false;
                        }
                    }

                    if ((propertySubtype === 'apartment' || propertySubtype === 'building') && $('#field-group-apartment').is(':visible')) {
                        if ($('#input_total_floors').val().trim() === "") {
                            triggerError('#input_total_floors', "Please fill in Total Floors.");
                            return false;
                        }
                        if ($('#input_property_on_floor').val().trim() === "") {
                            triggerError('#input_property_on_floor', "Please fill in Property On Floor.");
                            return false;
                        }
                    }

                    if ($('#storage_area_wrapper').is(':visible')) {
                        const storageInput = $('#input_storage_area');
                        if (storageInput.val().trim() === "") {
                            triggerError('#input_storage_area', "Please fill in the Storage Area.");
                            return false;
                        }
                    }

                    if ($('#field-group-plot').is(':visible')) {
                        if ($('#input_plot_area').val().trim() === "") {
                            triggerError('#input_plot_area', "Please fill in the Land Area.");
                            return false;
                        }
                        const plotUnit = $('select[name="plot_unit"]');
                        if (plotUnit.val() === "") {
                            triggerError('select[name="plot_unit"]', "Please select the Unit for Plot Area.");
                            return false;
                        }
                    }
                }
            }

            if (currentStep === 2) {
                if ($('#name').val().trim() === "") {
                    triggerError('#name', "Please enter Property Name.");
                    return false;
                }

                if ($('#permalink-section').is(':visible')) {
                    const permalinkInput = $('#permalink');
                    const permalinkValue = permalinkInput.val().trim();

                    if (permalinkValue === "") {
                        triggerError('#permalink', "Please enter a Permalink.");
                        return false;
                    }

                    if (window.permalinkIsValid === false) {
                        alert("The permalink is already taken. Please choose a different one.");
                        permalinkInput.focus();
                        return false;
                    }

                    if (window.permalinkIsValid === null || window.permalinkIsValid === undefined) {
                        let isUnique = null;
                        $.ajax({
                            url: '{{ route('check.slug.unique') }}',
                            method: 'POST',
                            async: false,
                            headers: { 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
                            contentType: 'application/json',
                            data: JSON.stringify({ permalink: permalinkValue, property_id: 'null' }),
                            success: function(data) { isUnique = data.unique; },
                            error: function() { isUnique = false; }
                        });
                        if (!isUnique) {
                            alert("The permalink is already taken. Please choose a different one.");
                            permalinkInput.focus();
                            return false;
                        }
                    }
                }

                if ($('#description').val().trim() === "") {
                    triggerError('#description', "Please enter Description.");
                    return false;
                }

                const houseTypeSelect = $('select[name="house_type"]');
                const houseTypeWrapper = houseTypeSelect.closest('.col-md-6, .col-md-4');
                if (houseTypeSelect.length && houseTypeWrapper.length && houseTypeWrapper.is(':visible') &&
                    houseTypeWrapper.css('display') !== 'none') {
                    if (houseTypeSelect.val() === "" || houseTypeSelect.val() === null) {
                        triggerError('select[name="house_type"]', "Please select House Type.");
                        return false;
                    }
                }

                if ($('#tenant_preference_wrapper').is(':visible')) {
                    if ($('input[name="tenant_preference[]"]:visible:checked').length === 0) {
                        alert("Please select at least one Tenant Preference.");
                        const firstVisiblePref = $('input[name="tenant_preference[]"]:visible').first();
                        if (firstVisiblePref.length) {
                            firstVisiblePref[0].scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                        }
                        return false;
                    }
                }

                if ($('#bedrooms').is(':visible') && $('#bedrooms').val().trim() === "") {
                    triggerError('#bedrooms', "Please enter number of Bedrooms.");
                    return false;
                }

                if ($('#bathrooms').is(':visible') && $('#bathrooms').val().trim() === "") {
                    triggerError('#bathrooms', "Please enter number of Bathrooms.");
                    return false;
                }

                if ($('#property_suitable_for_wrapper').is(':visible')) {
                    const suitableInput = $('input[name="property_suitable_for"]');
                    if (suitableInput.val().trim() === "") {
                        alert("Please enter what the property is suitable for (e.g. Food, Studio).");
                        suitableInput.addClass('is-invalid').focus();
                        return false;
                    }
                }

                if ($('#ownership_wrapper').is(':visible')) {
                    if ($('select[name="ownership_type"]').val() === "" || $('select[name="ownership_type"]')
                    .val() === null) {
                        triggerError('select[name="ownership_type"]', "Please select Ownership Type.");
                        return false;
                    }
                }

                if ($('select[name="furnishing_type"]').is(':visible')) {
                    if ($('select[name="furnishing_type"]').val() === "" || $('select[name="furnishing_type"]')
                        .val() === null) {
                        triggerError('select[name="furnishing_type"]', "Please select Furnishing Type.");
                        return false;
                    }
                }

                if ($('select[name="food_preference"]').is(':visible')) {
                    if ($('select[name="food_preference"]').val() === "" || $('select[name="food_preference"]')
                        .val() === null) {
                        triggerError('select[name="food_preference"]', "Please select Food Preference.");
                        return false;
                    }
                }

                if ($('input[name="pet_policy"]').first().is(':visible')) {
                    if ($('input[name="pet_policy"]:checked').length === 0) {
                        alert("Please select Pet Policy (Allowed or Not Allowed).");
                        document.getElementById('pet_allowed').scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                        return false;
                    }
                }

                const parkingCard = $('#parking_card');
                if (parkingCard.is(':visible') && parkingCard.css('display') !== 'none') {
                    if ($('input[name="parking_availability"]:checked').length === 0) {
                        alert("Please select Parking Availability (Yes or No).");
                        document.getElementById('parking_yes').scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                        return false;
                    }
                }


                if ($('#rent_lease_toggle_section').is(':visible')) {
                    if ($('input[name="rent_lease_type"]:checked').length === 0) {
                        alert("Please select if you are going to Rent or Lease.");
                        document.getElementById('rent_lease_toggle_section').scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                        return false;
                    }
                }

                if ($('#security_deposit_section').is(':visible')) {
                    if ($('input[name="security_deposit_type"]:checked').length === 0) {
                        alert("Please select a Security Deposit Type (Fixed or Negotiable).");
                        document.getElementById('sec_fixed').scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                        return false;
                    }
                }

                if ($('#maintenance_section').is(':visible')) {
                    if ($('input[name="maintenance_charge_status"]:checked').length === 0) {
                        alert("Please select if there is a Maintenance Charge.");
                        document.getElementById('maint_yes').scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                        return false;
                    }
                    if ($('input[name="maintenance_charge_status"]:checked').val() === 'Yes') {
                        const maintAmount = $('#maintenance_amount_input').val();
                        if (maintAmount === "" || maintAmount === null || parseFloat(maintAmount) <= 0) {
                            triggerError('#maintenance_amount_input',
                            "Please enter the Maintenance Charge amount.");
                            return false;
                        }
                    }
                }

                if ($('#price').val().trim() === "") {
                    triggerError('#price', "Please enter the Rent/Price amount.");
                    return false;
                }

                if ($('#lease_specific_fields').is(':visible')) {
                    if ($('#lease_duration').val() === "" || $('#lease_duration').val() === null) {
                        triggerError('#lease_duration', "Please select a Lease Duration.");
                        return false;
                    }
                    if ($('#maintenance_responsibility').val() === "" || $('#maintenance_responsibility').val() === null) {
                        triggerError('#maintenance_responsibility', "Please select Maintenance Responsibility.");
                        return false;
                    }
                }

                if ($('#availability_status').is(':visible')) {
                    if ($('#availability_status').val() === "" || $('#availability_status').val() === null) {
                        triggerError('#availability_status', "Please select Availability.");
                        return false;
                    }

                    if ($('#availability_status').val() === 'Available From') {
                        const availabilityDate = $('#availability_date');
                        if (availabilityDate.is(':visible') && (availabilityDate.val() === "" || availabilityDate
                                .val() === null)) {
                            triggerError('#availability_date', "Please select the Availability Date.");
                            return false;
                        }
                    }
                }

                const propertySubtype = $('#property_subtype').val();
                if (['godown', 'warehouse'].includes(propertySubtype)) {
                    if ($('#loading_unloading_wrapper').is(':visible')) {
                        if ($('input[name="loading_unloading_facility"]:checked').length === 0) {
                            alert("Please select Loading / Unloading Facility (Yes or No).");
                            document.getElementById('loading_unloading_wrapper').scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                            return false;
                        }
                    }
                }
            }

            if (currentStep === 3) {
                if ($('#state').val() === "") {
                    triggerError('#state', "Please select a State.");
                    return false;
                }
                if ($('#city').val() === "") {
                    triggerError('#city', "Please select a City.");
                    return false;
                }
                if ($('#location').val().trim() === "") {
                    triggerError('#location', "Please enter the Location.");
                    return false;
                }
            }

            if (currentStep === 4) {
                const categoryId = $('#category_id').val();
                if (categoryId === '3') {
                    if ($('#direction_facing').val() === "" || $('#direction_facing').val() === null) {
                        triggerError('#direction_facing', "Please select Direction Facing.");
                        return false;
                    }
                }
            }

            if (currentStep < totalSteps) {
                currentStep++;
                updateFormSteps();
            }
        });

        function updateFormSteps() {
            $('.form-step').addClass('d-none');
            $(`#step-${currentStep}`).removeClass('d-none');
            $('#prevBtn').toggle(currentStep > 1);
            $('#nextBtn').toggle(currentStep < totalSteps);
            $('#submitBtn').toggle(currentStep === totalSteps);
            updateStepperUI();

            if (currentStep === 3) {
                const selectedStateId = $('#state').val();
                if (selectedStateId && $('#city option').length <= 1) {
                    loadCitiesForState(selectedStateId);
                }
            }

            if (currentStep === 4 && typeof toggleDirectionFacing === 'function') {
                toggleDirectionFacing();
            }

            document.querySelector(".step-sidebar").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        function updateStepperUI() {
            $('.stepper li').removeClass('active completed');
            $('.stepper li').each(function(index) {
                if (index + 1 < currentStep) {
                    $(this).addClass('completed');
                } else if (index + 1 === currentStep) {
                    $(this).addClass('active');
                }
            });
        }

        $(document).ready(function() {
            updateFormSteps();

            $('#nextBtn').click(function() {
                if (validateCurrentStep()) {
                    if (currentStep < totalSteps) {
                        currentStep++;
                        updateFormSteps();
                    }
                }
            });

            $('#prevBtn').click(function() {
                if (currentStep > 1) {
                    currentStep--;
                    updateFormSteps();
                }
            });

            $('#state').on('change', function() {
                let stateId = $(this).val();
                $('#city').html('<option value="">Select City</option>');
                if (stateId) {
                    $.get('/get-cities/' + stateId, function(data) {
                        $.each(data, function(key, city) {
                            $('#city').append('<option value="' + city.id + '">' + city
                                .name + '</option>');
                        });
                    });
                }
            });

            function loadCitiesForState(stateId) {
                if (stateId) {
                    $.get('/get-cities/' + stateId, function(data) {
                        $('#city').html('<option value="">Select City</option>');
                        $.each(data, function(key, city) {
                            $('#city').append('<option value="' + city.id + '">' + city.name +
                                '</option>');
                        });
                    });
                }
            }

            $(document).ready(function() {
                const selectedStateId = $('#state').val();
                if (selectedStateId) {
                    loadCitiesForState(selectedStateId);
                }
            });
        });

        function addFacility() {
            const container = $("#facilitiesContainer");
            const newRow = $(`
            <div class="row facilities mt-2">
                <div class="col-md-5">
                    <select class="form-control" name="facilities[]" required>
                        <option value="">Select Facility</option>
                        @foreach ($product_cate as $facility)
                            <option value="{{ $facility->id }}" required>{{ $facility->name }}</option>
                        @endforeach
                    </select>
                </div>

                 <div class="col-md-5 position-relative mb-4">
                    <input type="text" class="form-control facility-value-input mb-1"
                        name="facility_values[]"
                        maxlength="50"
                        placeholder="Distance (E.g: 200m , 1km..) from here" required>
                    <small class="char-counter text-muted" style="position:absolute;right:10px;bottom:-20px;">50/50</small>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-outline-dark" onclick="removeRow(this)">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>`);
            container.append(newRow);

            const newRowElement = newRow[0];
            const facilitySelect = newRowElement.querySelector('select[name="facilities[]"]');
            const facilityValue = newRowElement.querySelector('input[name="facility_values[]"]');

            if (facilitySelect && facilityValue) {
                facilitySelect.addEventListener('change', function() {
                    validateFacilityField(this, facilityValue);
                });

                facilityValue.addEventListener('input', function() {
                    validateFacilityField(facilitySelect, this);
                });
            }
        }

        function addSpecification() {
            const container = $("#keySpecificationsContainer");
            const newRow = $(`
            <div class="row key-specification-row mb-2">
                <div class="col-md-10">
                    <input type="text" class="form-control"
                        name="key_specifications[]"
                        placeholder="Eg: 1st Floor, Parking, Lift, Power Backup">
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-outline-dark" onclick="removeRow(this)">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>`);
            container.append(newRow);
        }

        function removeRow(button) {
            $(button).closest('.row').remove();
        }

        function validateFacilityField(facilitySelect, facilityValue) {
            clearError(facilitySelect);
            clearError(facilityValue);
            if (facilitySelect.value && facilitySelect.value !== "" && facilitySelect.value !== "Select Facility") {
                if (!facilityValue.value || facilityValue.value.trim() === "") {
                    showError(facilityValue, "Please enter a distance value for the selected facility");
                    return false;
                }
            }

            if (facilityValue.value && facilityValue.value.trim() !== "") {
                if (!facilitySelect.value || facilitySelect.value === "" || facilitySelect.value === "Select Facility") {
                    showError(facilitySelect, "Please select a facility type");
                    return false;
                }
            }

            return true;
        }

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

            document.getElementById('facilitiesContainer').addEventListener('input', function(e) {
                if (e.target && e.target.classList.contains('facility-value-input')) {
                    updateCharCounter(e.target);
                }
            });
            document.querySelectorAll('.facilities').forEach(function(row) {
                const facilitySelect = row.querySelector('select[name="facilities[]"]');
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

            document.getElementById('facilitiesContainer').addEventListener('change', function(e) {
                if (e.target && e.target.name === 'facilities[]') {
                    const row = e.target.closest('.facilities');
                    const facilityValue = row.querySelector('input[name="facility_values[]"]');
                    if (facilityValue) {
                        validateFacilityField(e.target, facilityValue);
                    }
                }
            });

            document.getElementById('facilitiesContainer').addEventListener('input', function(e) {
                if (e.target && e.target.name === 'facility_values[]') {
                    const row = e.target.closest('.facilities');
                    const facilitySelect = row.querySelector('select[name="facilities[]"]');
                    if (facilitySelect) {
                        validateFacilityField(facilitySelect, e.target);
                    }
                }
            });
        });

        // All custom fields preloaded server-side — no per-category fetch needed.
        const _allCustomFieldsCache = @json($customFieldsByCategory ?? []);

        document.addEventListener("DOMContentLoaded", function() {
            document.querySelectorAll(".category-radio").forEach(radio => {
                radio.addEventListener("change", function() {
                    const categoryId = this.value;
                    const container = document.getElementById("customFieldsContainer");
                    if (!categoryId) {
                        container.innerHTML = "";
                        return;
                    }
                    const fields = _allCustomFieldsCache[categoryId];
                    if (fields && fields.length > 0) {
                        renderFields(fields);
                    } else {
                        container.innerHTML = "";
                    }
                });
            });
        });

        function sanitizeString(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }

        function generateUniqueId(label) {
            return 'field_' + label.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        }

        let level2FieldsContainer = null;

        function renderFields(fields) {
            const container = document.getElementById("customFieldsContainer");
            const fragment = document.createDocumentFragment();

            container.innerHTML = '';
            level2FieldsContainer = null; 

            fields.forEach(field => {
                const sanitizedLabel = sanitizeString(field.field_label || '');
                const requiredAsterisk = field.is_required ?
                    `<span class="required-asterisk text-danger" aria-hidden="true">*</span>` : '';
                const inputBase = `custom_fields[${sanitizedLabel}]`;
                const fieldId = generateUniqueId(field.field_label || 'unknown_field');
                const section = document.createElement('div');
                section.className = 'custom-fields-section border rounded p-3 mb-4';
                let html = '<div class="row g-3">';

                if (['text', 'number'].includes(field.field_type)) {
                    html += `
                <div class="form-group col-md-3 mb-3">
                    <label class="form-label"  for="${fieldId}">${sanitizedLabel} ${requiredAsterisk}</label>
                    <input type="${field.field_type}" class="form-control" id="${fieldId}" name="${inputBase}[value]" ${field.is_required ? 'required aria-required="true"' : ''}>
                    <input type="hidden" name="${inputBase}[input_type]" value="${field.field_type}">
                    <input type="hidden" name="${inputBase}[is_required]" value="${field.is_required ? 1 : 0}">
                    <div id="${fieldId}_error" class="text-danger dynamic-error mt-1"></div>
                </div>`;
                    html += `
                <div class="col-md-3 mb-3">
                    <label for="unit_${fieldId}" class="form-label">Unit <span class="text-danger">*</span></label>
                    <select class="form-select" id="unit_${fieldId}" name="custom_field_units[${sanitizedLabel}]" required>
                        <option value="">Select Unit</option>
                        <option value="1">Sq. Ft</option>
                        <option value="2">Square Inches</option>
                        <option value="3">Acres</option>
                        <option value="4">Cents</option>
                        <option value="5">Square Meters</option>
                        <option value="6">Square Yards</option>
                        <option value="7">Hectares</option>
                    </select>
                </div>`;

                }

                else if (field.field_type === 'checkbox') {
                    html += `
                <div class="form-group col-md-3 mb-3">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="${fieldId}" name="${inputBase}[value]" value="1" ${field.is_required ? 'required aria-required="true"' : ''}>
                        <label class="form-check-label" for="${fieldId}">${sanitizedLabel} ${requiredAsterisk}</label>
                        <input type="hidden" name="${inputBase}[input_type]" value="checkbox">
                        <input type="hidden" name="${inputBase}[is_required]" value="${field.is_required ? 1 : 0}">
                        <div id="${fieldId}_error" class="text-danger dynamic-error mt-1"></div>
                    </div>
                </div>`;
                }

                else if (field.field_type === 'radio' && Array.isArray(field.radio_options)) {
                    html += `
                <div class="form-group col-md-12 mb-3">
                    <fieldset>
                        <h6 class="form-label">${sanitizedLabel} ${requiredAsterisk}</h6>
                        <div class="d-flex flex-wrap gap-3 mb-3"> `;

                    field.radio_options.forEach(option => {
                        const sanitizedOption = sanitizeString(option.name);
                        const radioId = `${fieldId}_${sanitizedOption.replace(/[^a-zA-Z0-9]/g, '_')}`;
                        html += `
                            <div class="form-check form-check-inline">
                                <input type="radio" class="form-check-input" id="${radioId}" name="${inputBase}[value]" value="${sanitizedOption}" ${field.is_required ? 'required aria-required="true"' : ''} onclick="toggleRadioFields('${radioId}', '${sanitizedOption}', '${fieldId}')">
                                <label class="form-check-label" for="${radioId}">${sanitizedOption}</label>
                            </div>`;
                    });

                    html += `
                        </div> <input type="hidden" name="${inputBase}[input_type]" value="radio">
                        <input type="hidden" name="${inputBase}[is_required]" value="${field.is_required ? 1 : 0}">
                        <div id="${fieldId}_error" class="text-danger dynamic-error mt-1"></div>
                    </fieldset>
                </div>`;

                    html += `
                <div class="col-md-12">
                    <div id="level2_custom_fields_container_${fieldId}" class="level2-custom-fields-container row g-3" style="display: none;">
                        </div>
                </div>
            `;
                }

                if (Array.isArray(field.additional_fields) && field.additional_fields.length > 0) {
                    html += `
                <div class="col-12 mt-3 pt-3 border-top"> <h6>Additional Details</h6>
                </div>
            `;
                    field.additional_fields.forEach(extraField => {
                        const sanitizedExtraLabel = sanitizeString(extraField.label || '');
                        const extraName = `custom_fields_extra[${sanitizedExtraLabel}]`;
                        const extraId = generateUniqueId(extraField.label || 'unknown_extra_field');
                        const extraRequiredAsterisk = extraField.required === '1' ?
                            `<span class="required-asterisk text-danger" aria-hidden="true">*</span>` : '';
                        html += `
                    <div class="col-md-6 mb-3"> <label class="form-label mb-1" for="${extraId}">${sanitizedExtraLabel} ${extraRequiredAsterisk}</label>
                        <input type="${extraField.type}" class="form-control" id="${extraId}" name="${extraName}[value]" ${extraField.required === '1' ? 'required aria-required="true"' : ''}>
                        <input type="hidden" name="${extraName}[input_type]" value="${extraField.type}">
                        <input type="hidden" name="${extraName}[is_required]" value="${extraField.required === '1' ? 1 : 0}">
                        <div id="${extraId}_error" class="text-danger dynamic-error mt-1"></div>
                    </div>
                `;
                    });
                }

                html += '</div>';
                section.innerHTML = html;
                fragment.appendChild(section);
            });

            container.innerHTML = ''; 
            container.appendChild(fragment);
            document.dispatchEvent(new Event('customFieldsRendered'));
            window.toggleRadioFields = function(selectedRadioId, selectedOptionName, parentFieldId) {
                document.querySelectorAll('.level2-custom-fields-container').forEach(containerDiv => {
                    containerDiv.innerHTML = '';
                    containerDiv.style.display = 'none';
                });

                const targetContainer = document.getElementById(`level2_custom_fields_container_${parentFieldId}`);
                if (!targetContainer) {
                    console.error(`Target container for parentFieldId ${parentFieldId} not found.`);
                    return;
                }

                const possessionStatusSection = document.getElementById('possession-status-section');
                const bedroomsSection = document.getElementById('bedrooms-section');
                const bathroomsSection = document.getElementById('bathrooms-section');
                if (possessionStatusSection) possessionStatusSection.style.display = 'none';
                if (bedroomsSection) bedroomsSection.style.display = 'none';
                if (bathroomsSection) bathroomsSection.style.display = 'none';
                let secondLevelHtml = '';
                switch (selectedOptionName.toLowerCase()) {
                    case 'land':
                        secondLevelHtml = `
                            <h6 class="mt-2 mb-3 col-12">Land Details</h6>
                            <div class="col-md-4 mb-3">
                                <label class="form-label mb-1" for="land_plot_area_${parentFieldId}">Land Area <span class="text-danger">*</span></label>
                                <input type="number" class="form-control" id="land_plot_area_${parentFieldId}" name="custom_fields_level2[land_plot_area]" required>
                                <div id="land_plot_area_${parentFieldId}_error" class="text-danger dynamic-error mt-1"></div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label mb-1" for="land_unit_${parentFieldId}">Unit <span class="text-danger">*</span></label>
                                <select class="form-select" id="land_unit_${parentFieldId}" name="custom_fields_level2_units[land_plot_area_unit]" required>
                                    <option value="">Select Unit</option>
                                    <option value="1">Sq. Ft</option>
                                    <option value="2">Square Inches</option>
                                    <option value="3">Acres</option>
                                    <option value="4">Cents</option>
                                    <option value="5">Square Meters</option>
                                    <option value="6">Square Yards</option>
                                    <option value="7">Hectares</option>
                                </select>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label mb-1" for="land_plot_length_${parentFieldId}">Length</label>
                                <input type="number" class="form-control" id="land_plot_length_${parentFieldId}" name="custom_fields_level2[land_plot_length]">
                                <div id="land_plot_length_${parentFieldId}_error" class="text-danger dynamic-error mt-1"></div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label mb-1" for="land_plot_breadth_${parentFieldId}">Breadth</label>
                                <input type="number" class="form-control" id="land_plot_breadth_${parentFieldId}" name="custom_fields_level2[land_plot_breadth]">
                                <div id="land_plot_breadth_${parentFieldId}_error" class="text-danger dynamic-error mt-1"></div>
                            </div>
                        `;
                    break;
                    case 'plots':
                        secondLevelHtml = `
                            <h6 class="mt-2 mb-3 col-12">Plot Details</h6>
                            <div class="col-md-4 mb-3">
                                <label class="form-label mb-1" for="land_plot_area_${parentFieldId}">Plot Area <span class="text-danger">*</span></label>
                                <input type="number" class="form-control" id="land_plot_area_${parentFieldId}" name="custom_fields_level2[land_plot_area]" required>
                                <div id="land_plot_area_${parentFieldId}_error" class="text-danger dynamic-error mt-1"></div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label mb-1" for="land_unit_${parentFieldId}">Unit <span class="text-danger">*</span></label>
                                <select class="form-select" id="land_unit_${parentFieldId}" name="custom_fields_level2_units[land_plot_area_unit]" required>
                                    <option value="">Select Unit</option>
                                    <option value="1">Sq. Ft</option>
                                    <option value="2">Square Inches</option>
                                    <option value="3">Acres</option>
                                    <option value="4">Cents</option>
                                    <option value="5">Square Meters</option>
                                    <option value="6">Square Yards</option>
                                    <option value="7">Hectares</option>
                                </select>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label mb-1" for="land_plot_length_${parentFieldId}">Length</label>
                                <input type="number" class="form-control" id="land_plot_length_${parentFieldId}" name="custom_fields_level2[land_plot_length]">
                                <div id="land_plot_length_${parentFieldId}_error" class="text-danger dynamic-error mt-1"></div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label mb-1" for="land_plot_breadth_${parentFieldId}">Breadth</label>
                                <input type="number" class="form-control" id="land_plot_breadth_${parentFieldId}" name="custom_fields_level2[land_plot_breadth]">
                                <div id="land_plot_breadth_${parentFieldId}_error" class="text-danger dynamic-error mt-1"></div>
                            </div>
                        `;
                    break;
                    case 'shop':
                        secondLevelHtml = `
                            <h6 class="mt-2 mb-3 col-12">Shop Details</h6>
                            <div class="col-md-4 mb-3">
                                <label class="form-label mb-1" for="shop_buildup_area_${parentFieldId}">Built-up Area <span class="text-danger">*</span></label>
                                <input type="number" class="form-control" id="shop_buildup_area_${parentFieldId}" name="custom_fields_level2[shop_buildup_area]" required>
                                <div id="shop_buildup_area_${parentFieldId}_error" class="text-danger dynamic-error mt-1"></div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label mb-1" for="shop_unit_${parentFieldId}">Unit <span class="text-danger">*</span></label>
                                <select class="form-select" id="shop_unit_${parentFieldId}" name="custom_fields_level2_units[shop_buildup_area_unit]" required>
                                    <option value="">Select Unit</option>
                                    <option value="1">Sq. Ft</option>
                                    <option value="2">Square Inches</option>
                                    <option value="3">Acres</option>
                                    <option value="4">Cents</option>
                                    <option value="5">Square Meters</option>
                                    <option value="6">Square Yards</option>
                                    <option value="7">Hectares</option>
                                </select>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label mb-1" for="shop_carpet_area_${parentFieldId}">Carpet Area</label>
                                <input type="number" class="form-control" id="shop_carpet_area_${parentFieldId}" name="custom_fields_level2[shop_carpet_area]">
                                <div id="shop_carpet_area_${parentFieldId}_error" class="text-danger dynamic-error mt-1"></div>
                            </div>
                        `;
                        
                        if (possessionStatusSection) {
                            possessionStatusSection.style.display = '';
                            document.querySelectorAll('input[name="possession_status"]').forEach(radio => {
                                radio.setAttribute('required', 'required');
                            });
                            document.dispatchEvent(new Event('possessionStatusVisible'));
                        }
                        if (bathroomsSection) {
                            bathroomsSection.style.setProperty('display', '', 'important');
                            const bathroomsInp = document.getElementById('bathrooms');
                            if (bathroomsInp) bathroomsInp.removeAttribute('required');
                        }
                    break;
                    case 'building':
                        secondLevelHtml = `
                            <h6 class="mt-2 mb-3 col-12">Building Details</h6>
                            <div class="col-md-4 mb-3">
                                <label class="form-label mb-1" for="building_buildup_area_${parentFieldId}">Built-up Area <span class="text-danger">*</span></label>
                                <input type="number" class="form-control" id="building_buildup_area_${parentFieldId}" name="custom_fields_level2[building_buildup_area]" required>
                                <div id="building_buildup_area_${parentFieldId}_error" class="text-danger dynamic-error mt-1"></div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label mb-1" for="building_unit_${parentFieldId}">Unit <span class="text-danger">*</span></label>
                                <select class="form-select" id="building_unit_${parentFieldId}" name="custom_fields_level2_units[building_buildup_area_unit]" required>
                                    <option value="">Select Unit</option>
                                    <option value="1">Sq. Ft</option>
                                    <option value="2">Square Inches</option>
                                    <option value="3">Acres</option>
                                    <option value="4">Cents</option>
                                    <option value="5">Square Meters</option>
                                    <option value="6">Square Yards</option>
                                    <option value="7">Hectares</option>
                                </select>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label mb-1" for="building_carpet_area_${parentFieldId}">Carpet Area</label>
                                <input type="number" class="form-control" id="building_carpet_area_${parentFieldId}" name="custom_fields_level2[building_carpet_area]">
                                <div id="building_carpet_area_${parentFieldId}_error" class="text-danger dynamic-error mt-1"></div>
                            </div>
                        `;
                        if (possessionStatusSection) {
                            possessionStatusSection.style.display = '';                          
                            document.querySelectorAll('input[name="possession_status"]').forEach(radio => {
                                radio.setAttribute('required', 'required');
                            });
                            document.dispatchEvent(new Event('possessionStatusVisible'));
                        }
                        if (bathroomsSection) bathroomsSection.style.display = '';
                    break;
                    default:
                        secondLevelHtml = '<p class="col-12">No specific details for this selection.</p>';
                    break;
                }

                targetContainer.innerHTML = secondLevelHtml;
                targetContainer.style.display =
                'flex';
            };

            container.querySelectorAll("input:not([type='radio']):not([type='checkbox']), select, textarea").forEach(
                input => {
                    input.addEventListener('input', function() {
                        if (this.hasAttribute('required')) {
                            if (this.tagName === 'SELECT') {
                                if (this.value && this.value !== "") {
                                    clearError(this);
                                } else {
                                    showError(this, "Please select an option");
                                }
                            } else if (this.type === 'file') {
                                if (this.files.length > 0) {
                                    clearError(this);
                                } else {
                                    showError(this, "Please upload a file");
                                }
                            } else {
                                if (this.value.trim()) {
                                    clearError(this);
                                } else {
                                    showError(this, "This field is required");
                                }
                            }
                        }
                    });
                    input.addEventListener('blur', function() {
                        if (this.hasAttribute('required')) {
                            if (this.tagName === 'SELECT') {
                                if (!this.value || this.value === "") {
                                    showError(this, "Please select an option");
                                }
                            } else if (this.type === 'file') {
                            } else {
                                if (!this.value.trim()) {
                                    showError(this, "This field is required");
                                }
                            }
                        }
                    });
                });
            container.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
                if (checkbox.hasAttribute('required')) {
                    checkbox.addEventListener('change', function() {
                        if (this.checked) {
                            clearError(this);
                        } else {
                            showError(this, "This checkbox must be checked");
                        }
                    });
                }
            });
            container.querySelectorAll("input[type='radio']").forEach(radio => {
                if (radio.hasAttribute('required')) {
                    radio.addEventListener('change', function() {
                        const groupName = this.name;
                        const groupRadios = container.querySelectorAll(
                            `input[type='radio'][name='${groupName}']`);
                        const isChecked = Array.from(groupRadios).some(r => r.checked);

                        if (isChecked) {
                            clearError(
                            this); 
                        } else {
                            showError(this, `This field is required`);
                        }
                    });
                }
            });
        }

        function toggleRadioFields(radioId, radioName) {
            document.querySelectorAll(`.sub-fields`).forEach(el => {
                el.style.display = "none";
                el.innerHTML = "";
            });

            const subFieldsContainer = document.getElementById(`sub_fields_${radioId}`);
            if (!subFieldsContainer) return;

            const activeCategoryRadio = document.querySelector(".category-radio:checked");
            const categoryId = activeCategoryRadio ? activeCategoryRadio.value : null;
            if (!categoryId) return;

            const fields = _allCustomFieldsCache[categoryId];
            if (!fields) return;

            const radioField = fields.find(f => f.field_type === "radio" && Array.isArray(f.radio_options) &&
                f.radio_options.some(opt => opt.name === radioName));
            if (radioField) {
                const selectedOption = radioField.radio_options.find(opt => opt.name === radioName);
                if (selectedOption && Array.isArray(selectedOption.fields)) {
                    selectedOption.fields.forEach(subField => {
                        subFieldsContainer.innerHTML += `
                            <div class="form-group col-md-6">
                                <label>${subField.label} ${subField.required === "1" ? '<span class="required-asterisk">*</span>' : ''}</label>
                                <input type="${subField.type}" class="form-control"
                                    name="custom_fields_extra[${radioName}][${subField.label}][value]"
                                    ${subField.required === "1" ? "required" : ""}>
                                <input type="hidden" name="custom_fields_extra[${radioName}][${subField.label}][input_type]" value="${subField.type}">
                                <input type="hidden" name="custom_fields_extra[${radioName}][${subField.label}][is_required]" value="${subField.required === "1" ? 1 : 0}">
                            </div>`;
                    });
                    subFieldsContainer.style.display = "flex";
                    subFieldsContainer.style.flexWrap = "wrap";
                }
            }
        }

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

        const categoryOptions = {
            0: 'Land',
            1: 'Shop',
            2: 'Building',
        };

        let sno = 0;

        function addRow() {
            sno++;

            const selectedCategoryId = parseInt($('input[name="category_id"]:checked').val());
            console.log('Selected Category ID:', selectedCategoryId);

            if (isNaN(selectedCategoryId)) {
                alert('No category selected!');
                return;
            }

            const radioOption = categoryOptions[selectedCategoryId];
            console.log('Radio Option:', radioOption);

            const disableFields = (radioOption === 0);
            console.log('Disable bedrooms/bathrooms:', disableFields);

            const data = `
                <div style="background: aliceblue; padding: 3%;" class="card mt-1 facility-extra" id="card${sno}">
                    <button onclick="removeCard('card${sno}')" type="button" class="close-btn" style="float:right; background:none; border:none;">❌</button>

                    <div class="form-group">
                        <label for="extra_name_${sno}">Name</label>
                        <input type="text" class="form-control" name="extras[${sno}][name]" id="extra_name_${sno}" required>
                    </div>

                    <div class="form-group">
                        <label for="extra_description_${sno}">Description</label>
                        <textarea class="form-control" id="extra_description_${sno}" name="extras[${sno}][description]" rows="4" required></textarea>
                    </div>

                    <div class="form-group">
                        <label for="extra_image_${sno}">Extra File</label>
                        <input type="file" class="form-control extra-file-input" name="extras[${sno}][image]" id="extra_image_${sno}" accept=".jpg,.jpeg,.png,.pdf">
                        <div class="preview-area mt-2"></div>
                    </div>

                    <div class="form-group bedrooms-group" style="${disableFields ? 'display:none;' : ''}">
                        <label for="extra_bedrooms_${sno}">Bedrooms</label>
                        <input type="text" class="form-control" name="extras[${sno}][bedrooms]" id="extra_bedrooms_${sno}">
                    </div>

                    <div class="form-group bathrooms-group" style="${disableFields ? 'display:none;' : ''}">
                        <label for="extra_bathrooms_${sno}">Bathrooms</label>
                        <input type="text" class="form-control" name="extras[${sno}][bathrooms]" id="extra_bathrooms_${sno}">
                    </div>
                </div>`
            ;

            $('#mylist').append(data);

            if (disableFields) {
                $(`#extra_bedrooms_${sno}`).val(''); 
                $(`#extra_bathrooms_${sno}`).val('');
            }

            const newCard = document.getElementById(`card${sno}`);

            newCard.querySelectorAll("input:not([type='radio']):not([type='checkbox']), select, textarea").forEach(
            input => {
                input.addEventListener('input', function() {
                    if (this.hasAttribute('required')) {
                        if (this.tagName ===
                            'SELECT') {
                            if (this.value && this.value !== "") {
                                clearError(this);
                            } else {
                                showError(this, "Please select an option");
                            }
                        } else if (this.type === 'file') {
                            if (this.files.length > 0) {
                                clearError(this);
                            } else {
                                showError(this, "Please upload a file");
                            }
                        } else { 
                            if (this.value.trim()) {
                                clearError(this);
                            } else {
                                showError(this, "This field is required");
                            }
                        }
                    }
                });
                input.addEventListener('blur', function() {
                    if (this.hasAttribute('required')) {
                        if (this.tagName === 'SELECT') {
                            if (!this.value || this.value === "") {
                                showError(this, "Please select an option");
                            }
                        } else if (this.type === 'file') {
                        } else {
                            if (!this.value.trim()) {
                                showError(this, "This field is required");
                            }
                        }
                    }
                });
            });

            newCard.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
                if (checkbox.hasAttribute('required')) {
                    checkbox.addEventListener('change', function() {
                        if (this.checked) {
                            clearError(this);
                        } else {
                            showError(this, "This checkbox must be checked");
                        }
                    });
                }
            });

            newCard.querySelectorAll("input[type='radio']").forEach(radio => {
                if (radio.hasAttribute('required')) {
                    radio.addEventListener('change', function() {
                        const groupName = this.name;
                        const groupRadios = newCard.querySelectorAll(
                            `input[type='radio'][name='${groupName}']`);
                        const isChecked = Array.from(groupRadios).some(r => r.checked);

                        if (isChecked) {
                            clearError(this);
                        } else {
                            showError(this, `This field is required`);
                        }
                    });
                }
            });
        }

        function removeCard(cardId) {
            $("#" + cardId).remove();
        }

        $(document).ready(function() {
            if ($('input[name="category_id"]:checked').length) {
                addRow();
            } else {
                console.log('No category selected on page load');
            }

            $('.category-radio').on('change', function() {
                $('#mylist').empty();
                addRow();
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            const radios = document.querySelectorAll('input[name="owner_type"]');

            function updateCheckIcons() {
                document.querySelectorAll('.check-icon').forEach(icon => {
                    icon.style.display = 'none';
                });

                const selectedRadio = document.querySelector('input[name="owner_type"]:checked');
                if (selectedRadio) {
                    const label = selectedRadio.closest('.form-check').querySelector('.check-icon');
                    if (label) label.style.display = 'inline';
                }
            }

            radios.forEach(radio => {
                radio.addEventListener('change', updateCheckIcons);
            });

            updateCheckIcons();
        });

        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('input[name="possession_status"]').forEach(function(radio) {
                radio.addEventListener('change', function() {
                    clearError(radio); 
                });
            });

            function ensurePossessionStatusRequired() {
                const possessionStatusSection = document.getElementById('possession-status-section');
                if (possessionStatusSection && possessionStatusSection.style.display !== 'none') {
                    const selectedStatus = document.querySelector('input[name="possession_status"]:checked');
                    if (!selectedStatus) {
                        showError(document.querySelector('input[name="possession_status"]'), '');
                    }
                }
            }
            document.addEventListener('possessionStatusVisible', ensurePossessionStatusRequired);
        });

        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('input[name="brokerage_type"]').forEach(function(radio) {
                radio.addEventListener('change', function() {
                    clearError(radio);
                });
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            var feeInput = document.getElementById('brokerage_fee');
            if (feeInput) {
                feeInput.addEventListener('input', function() {
                    clearError(feeInput);
                });
            }
        });

        function updateCategoryIcons() {
            document.querySelectorAll('.category-radio').forEach(radio => {
                const formCheck = radio.closest('.form-check');
                const label = formCheck ? formCheck.querySelector('.check-icon') : null;
                if (label) {
                    label.style.display = radio.checked ? 'inline' : 'none';
                }
            });
        }

        document.addEventListener('DOMContentLoaded', function() {
            updateCategoryIcons(); 
            document.querySelectorAll('.category-radio').forEach(radio => {
                radio.addEventListener('change', updateCategoryIcons);
            });

            const imageSuccessMessage = document.getElementById('image-success-message');
            if (imageSuccessMessage) {
                imageSuccessMessage.style.display = 'none';
            }
        });

        const input = document.getElementById('images');
        const previewContainer = document.getElementById('preview-container');
        window.fileList = []; 

        input.addEventListener('change', (e) => {
            const newFiles = Array.from(e.target.files);
            const maxFileSize = 2 * 1024 * 1024;  
            const validFiles = [];
            const invalidFiles = [];
            newFiles.forEach(file => {
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                const allowedExtensions = ['.jpg', '.jpeg', '.png'];
                const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

                const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(
                    fileExtension);
                const isValidSize = file.size <= maxFileSize;

                if (!isValidType) {
                    console.log('File rejected - invalid type:', file.name, 'Type:', file.type);
                    invalidFiles.push({
                        file: file,
                        reason: 'type'
                    });
                } else if (!isValidSize) {
                    console.log('File rejected - too large:', file.name);
                    invalidFiles.push({
                        file: file,
                        reason: 'size'
                    });
                } else {
                    console.log('File accepted:', file.name);
                    validFiles.push(file);
                }
            });

            console.log('Invalid files count:', invalidFiles.length);
            console.log('Valid files count:', validFiles.length);

            if (invalidFiles.length > 0) {
                console.log('Attempting to show file validation warning...');
                const fileSizeWarning = document.getElementById('file-size-warning');
                const fileSizeMessage = document.getElementById('file-size-message');
                console.log('fileSizeWarning element:', fileSizeWarning);
                console.log('fileSizeMessage element:', fileSizeMessage);

                if (fileSizeWarning && fileSizeMessage) {
                    console.log('Showing file validation warning...');
                    fileSizeWarning.style.display = 'block';
                    const typeRejections = invalidFiles.filter(item => item.reason === 'type').length;
                    const sizeRejections = invalidFiles.filter(item => item.reason === 'size').length;
                    let warningMessage = '';
                    if (typeRejections > 0 && sizeRejections > 0) {
                        warningMessage =
                            `${typeRejections} file(s) rejected - invalid type, ${sizeRejections} file(s) rejected - too large`;
                    } else if (typeRejections > 0) {
                        warningMessage = `${typeRejections} file(s) rejected - only images (JPG, PNG) are allowed`;
                    } else {
                        warningMessage = `${sizeRejections} file(s) rejected - image greater than 2 mb`;
                    }
                    fileSizeMessage.textContent = warningMessage;
                    input.classList.add('is-invalid');
                    setTimeout(() => {
                        fileSizeWarning.style.display = 'none';
                        input.classList.remove('is-invalid');
                    }, 8000);
                } else {
                    console.log('Warning elements not found!');
                }
            }
            const currentLimit = window.currentImageLimit || 15; 
            const totalFiles = window.fileList.length + validFiles.length;

            if (totalFiles > currentLimit) {
                const allowedFiles = validFiles.slice(0, currentLimit - window.fileList.length);
                allowedFiles.forEach(file => window.fileList.push(file));
                const imageLimitWarning = document.getElementById('image-limit-warning');
                const imageLimitMessage = document.getElementById('image-limit-message');
                if (imageLimitWarning && imageLimitMessage) {
                    imageLimitWarning.style.display = 'block';
                    imageLimitMessage.textContent = `Only the first ${currentLimit} images will be uploaded.`;
                    input.classList.add('is-invalid');
                    setTimeout(() => {
                        imageLimitWarning.style.display = 'none';
                        input.classList.remove('is-invalid');
                    }, 3000);
                }
            } else {
                validFiles.forEach(file => window.fileList.push(file));
            }

            if (validFiles.length > 0) {
                const imageSuccessMessage = document.getElementById('image-success-message');
                const imageSuccessText = document.getElementById('image-success-text');
                if (imageSuccessMessage && imageSuccessText) {
                    imageSuccessMessage.style.display = 'block';
                    imageSuccessText.textContent = `${validFiles.length} image(s) added successfully`;
                    setTimeout(() => {
                        imageSuccessMessage.style.display = 'none';
                    }, 3000);
                }
            } else {
                const imageSuccessMessage = document.getElementById('image-success-message');
                if (imageSuccessMessage) {
                    imageSuccessMessage.style.display = 'none';
                }
            }

            renderPreviews();
            input.value = ''; 
            if (validFiles.length === 0) {
                const imageSuccessMessage = document.getElementById('image-success-message');
                if (imageSuccessMessage) {
                    imageSuccessMessage.style.display = 'none';
                }
            }
            if (window.checkImageCount) {
                window.checkImageCount();
            }
        });

        window.renderPreviews = function() {
            previewContainer.innerHTML = '';
            const currentLimit = window.currentImageLimit || 15; 

            window.fileList.forEach((file, index) => {
                if (index >= currentLimit) return; 
                const reader = new FileReader();
                reader.onload = function(event) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'position-relative m-2';
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    img.style.width = '120px';
                    img.style.height = '120px';
                    img.className = 'img-thumbnail';
                    const btn = document.createElement('button');
                    btn.textContent = '×';
                    btn.className = 'btn btn-danger btn-sm position-absolute';
                    btn.style.top = '0';
                    btn.style.right = '0';
                    btn.onclick = () => {
                        window.fileList.splice(index, 1);
                        renderPreviews();
                        const imageSuccessMessage = document.getElementById('image-success-message');
                        if (imageSuccessMessage) {
                            imageSuccessMessage.style.display = 'none';
                        }
                        if (window.checkImageCount) {
                            window.checkImageCount();
                        }
                    };

                    wrapper.appendChild(img);
                    wrapper.appendChild(btn);
                    previewContainer.appendChild(wrapper);
                };
                reader.readAsDataURL(file);
            });
        }

        document.getElementById('propertyForm').addEventListener('submit', function(e) {
            const imageSuccessMessage = document.getElementById('image-success-message');
            if (imageSuccessMessage) {
                imageSuccessMessage.style.display = 'none';
            }

            if (window.fileList.length) {
                const dataTransfer = new DataTransfer();
                window.fileList.forEach(file => dataTransfer.items.add(file));
                input.files = dataTransfer.files;
            }
        });
        
        const priceInput = document.getElementById('price');
        const priceInWordsInput = document.getElementById('price_in_words');

        priceInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9.]/g, '');
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }

            const intPartNum = parseInt(parts[0]) || 0;
            let intPart = parts[0] ? Number(parts[0]).toLocaleString('en-IN') : '';
            let decPart = parts[1] !== undefined ? '.' + parts[1] : '';
            e.target.value = intPart + decPart;

            if (parts[0] && !isNaN(parts[0])) {
                const priceInWords = convertNumberToWords(Math.floor(Number(parts[0])));
                priceInWordsInput.value = priceInWords;

            } else {
                priceInWordsInput.value = '';
            }
        });

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

        document.getElementById('propertyForm').addEventListener('submit', function() {
            const priceInput = document.getElementById('price');
            priceInput.value = priceInput.value.replace(/,/g, '');
            const brokerageFeeInput = document.getElementById('brokerage_fee');
            const selectedBrokerageType = document.querySelector('input[name="brokerage_type"]:checked');
            if (brokerageFeeInput && selectedBrokerageType && selectedBrokerageType.value === 'percentage') {
                brokerageFeeInput.value = brokerageFeeInput.value.replace(/%/g, '');
            } else if (brokerageFeeInput && brokerageFeeInput.value) {
                brokerageFeeInput.value = brokerageFeeInput.value.replace(/,/g, '');
            }
        });
        
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.feature-checkbox').forEach(function(checkbox) {
                const tickIcon = checkbox.nextElementSibling.querySelector('.tick-icon');
                tickIcon.style.display = checkbox.checked ? 'inline' : 'none';
                checkbox.addEventListener('change', function() {
                    tickIcon.style.display = this.checked ? 'inline' : 'none';
                });
            });
        });
        
        document.addEventListener("DOMContentLoaded", function() {
            var input = document.getElementById('region');
            if (input) {
                new Tagify(input);
            }
        });
        
        const propertyForm = document.getElementById('propertyForm');

        if (propertyForm) {
            propertyForm.querySelectorAll("input:not([type='radio']):not([type='checkbox']), select, textarea").forEach(input => {
                input.addEventListener('input', function() {
                    if (this.hasAttribute('required')) {
                        if (this.type === 'file') {
                            if (this.files.length > 0) {
                                clearError(this);
                            } else {
                                showError(this, "Please upload a file");
                            }
                        } else if (this.tagName === 'SELECT') {
                            if (this.value && this.value !== "Select City" && this.value !== "") {
                                clearError(this);
                            } else {
                                showError(this, "Please select an option");
                            }
                        } else { 
                            if (this.value.trim()) {
                                clearError(this);
                            } else {
                                showError(this, "This field is required");
                            }
                        }
                    }
                });

                input.addEventListener('blur', function() {
                    if (this.hasAttribute('required')) {
                        if (this.type === 'file') {
                        } else if (this.tagName === 'SELECT') {
                            if (this.value && this.value !== "Select City" && this.value !== "") {
                                clearError(this);
                            } else {
                                showError(this,
                                "Please select an option");
                            }
                        } else {
                            if (this.value.trim()) {
                                clearError(this);
                            } else {
                                showError(this,
                                "This field is required"); 
                            }
                        }
                    }
                });
            });

            propertyForm.querySelectorAll("input[type='radio'][required]").forEach(radio => {
                radio.addEventListener('change', function() {
                    const groupName = this.name;
                    const group = propertyForm.querySelectorAll(`input[type='radio'][name='${groupName}']`);
                    const isChecked = Array.from(group).some(r => r.checked);
                    const firstRadio = group[
                    0];

                    if (isChecked) {
                        clearError(firstRadio);  
                    } else {
                        showError(firstRadio, `This field is required`);  
                    }
                });
            });

            propertyForm.querySelectorAll("input[type='checkbox'][required]").forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        clearError(this);
                    } else {
                        showError(this, "This checkbox must be checked");
                    }
                });
            });
        }

            document.getElementById('permalink').addEventListener('input', function() {
                document.getElementById('permalink-preview').textContent = this.value;
            });

        $(document).ready(function() {
            $('#permalink').on('input', function() {
                let text = $(this).val();
                text = text.replace(/\s+/g, '-'); 
                $(this).val(text);
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
        
        document.getElementById("propertyForm").addEventListener("submit", function(e) {
            const form = this;
            form.querySelectorAll('[required]').forEach(function(el) {
                if (el.offsetParent === null && el.type !== 'hidden') {
                    el.removeAttribute('required');
                }
            });
        });
        
        document.getElementById("propertyForm").addEventListener("submit", function(e) {
            let valid = true;
            const form = this;
            const formData = new FormData(form);
            for (let [key, value] of formData.entries()) {
                console.log(`Field: ${key} = `, value);
            }
            
            const arrayFields = {};
            for (let [key, value] of formData.entries()) {
                if (key.includes('[]')) {
                    if (!arrayFields[key]) {
                        arrayFields[key] = [];
                    }
                    arrayFields[key].push(value);
                }
            }
            if (Object.keys(arrayFields).length > 0) {
                console.log("=== ARRAY FIELDS DETECTED ===", arrayFields);
            }

            const possessionStatusSection = document.getElementById('possession-status-section');
            if (possessionStatusSection && possessionStatusSection.style.display !== 'none') {
                document.querySelectorAll('input[name="possession_status"]').forEach(radio => {
                    radio.setAttribute('required', 'required');
                });
            }
            const requiredRadios = form.querySelectorAll("input[type='radio'][required]");
            const checkedRadioNames = new Set();

            requiredRadios.forEach(radio => {
                const name = radio.name;
                if (checkedRadioNames.has(name)) return;
                if (radio.offsetParent === null) {
                    checkedRadioNames.add(name);
                    return;
                }

                const group = form.querySelectorAll(`input[type='radio'][name='${name}']`);
                const isChecked = Array.from(group).some(r => r.checked);

                if (!isChecked) {
                    valid = false;
                    if (name === 'possession_status') {
                        alert('Please select a possession status (Ready to occupy or Under construction)');
                    } else {
                        alert(
                            `Please select an option for: ${name.replace("custom_fields[", "").replace("][value]", "")}`);
                    }
                }

                checkedRadioNames.add(name);
            });

            const requiredInputs = form.querySelectorAll("input[required]:not([type='radio']), textarea[required]");
            requiredInputs.forEach(input => {
                if (input.offsetParent !== null && !input.value.trim()) {
                    valid = false;
                    alert(`Please fill out the required field: ${input.name}`);
                }
            });
            if (window.fileList) {
                const selected = document.querySelector('input[name="owner_type"]:checked');
                const imageLimits = {
                    'Owner': 15,
                    'Builder': 15,
                    'Consultant': 5
                };

                if (selected && imageLimits[selected.value]) {
                    const currentLimit = imageLimits[selected.value];
                    const currentCount = window.fileList.length;

                    if (currentCount > currentLimit) {
                        valid = false;
                        alert(
                            `You can only upload up to ${currentLimit} images. Please remove ${currentCount - currentLimit} image(s) before submitting.`);
                    }
                }
            }

            if (!valid) {
                e.preventDefault();
            }
        });
        document.getElementById("propertyForm").addEventListener("submit", function(e) {
            let valid = true;
            const ownerRadios = document.querySelectorAll("input[name='owner_type']");
            const isAnyOwnerOptionVisible = Array.from(ownerRadios).some(r => r.offsetParent !== null);
            const isAnyOwnerSelected = Array.from(ownerRadios).some(r => r.checked);

            if (isAnyOwnerOptionVisible && !isAnyOwnerSelected) {
                valid = false;
                alert("Please select an Owner Type (Owner, Builder, or Consultant).");
            }


            if (!valid) {
                e.preventDefault();
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
            const videoUrlInput = document.getElementById('video_url');
            const thumbnailInput = document.getElementById('video_thumbnail');
            const thumbnailCount = document.getElementById('thumbnail-count');

            function getYouTubeId(url) {
                const regExp =
                    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
                const match = url.match(regExp);
                return match ? match[1] : null;
            }

            if (videoUrlInput) {
                videoUrlInput.addEventListener('input', function() {
                    const videoId = getYouTubeId(this.value);
                    const previewContainer = document.getElementById('video_thumbnail_preview_container');
                    if (videoId) {
                        if (previewContainer) {
                            previewContainer.innerHTML = '';
                            const wrapper = document.createElement('div');
                            wrapper.className = 'position-relative d-inline-block';
                            const img = document.createElement('img');
                            img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                            img.style.maxWidth = '200px';
                            img.style.maxHeight = '120px';
                            img.style.border = '1px solid #ccc';
                            img.alt = 'YouTube thumbnail';
                            const btn = document.createElement('button');
                            btn.textContent = '×';
                            btn.className = 'btn btn-danger btn-sm position-absolute';
                            btn.style.top = '0';
                            btn.style.right = '0';
                            btn.onclick = removeVideoThumbnail;
                            wrapper.appendChild(img);
                            wrapper.appendChild(btn);
                            previewContainer.appendChild(wrapper);
                        }
                    } else {
                        if (previewContainer) {
                            previewContainer.innerHTML = '';
                        }
                    }
                });
            }

            if (thumbnailInput && thumbnailCount) {
                thumbnailInput.addEventListener('input', function() {
                    const len = this.value.length;
                    thumbnailCount.textContent = `(${len}/250)`;
                });
            }
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
 
        document.addEventListener('DOMContentLoaded', function() {
            const renew24Hours = document.getElementById('renew_24_hours');
            const renew30Days = document.getElementById('renew_30_days');
            const autoRenewalCard = document.getElementById('auto-renewal-card');

            function toggleAutoRenewalCard() {
                const propertyFor = document.querySelector('input[name="property_for"]:checked')?.value;
                if (autoRenewalCard) {
                    if (propertyFor === 'sell') {
                        autoRenewalCard.style.display = '';
                    } else {
                        autoRenewalCard.style.display = 'none';
                        if (renew24Hours) renew24Hours.checked = false;
                        if (renew30Days) renew30Days.checked = false;
                    }
                }
            }

            document.querySelectorAll('input[name="property_for"]').forEach(function(radio) {
                radio.addEventListener('change', toggleAutoRenewalCard);
            });

            // Run once on load
            toggleAutoRenewalCard();

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
            console.log('SEO Image and Video Thumbnail validation script loaded');

            const seoImageInput = document.getElementById('seo_img');
            const videoThumbnailInput = document.getElementById('video_thumbnail');

            console.log('Input elements found:', {
                seoImageInput: seoImageInput,
                videoThumbnailInput: videoThumbnailInput
            });

            function validateImageFile(file, fieldType) {
                console.log('validateImageFile called with:', {
                    file: file.name,
                    fieldType
                });

                const maxFileSize = 2 * 1024 * 1024; 
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];

                const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
                const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
                const isValidSize = file.size <= maxFileSize;

                console.log('Validation details:', {
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
                console.log('showValidationMessage called with:', {
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

                console.log('Elements found:', {
                    warningElement: warningElement,
                    messageElement: messageElement,
                    successElement: successElement
                });

                if (warningElement && messageElement && successElement) {
                    warningElement.style.display = 'none';
                    successElement.style.display = 'none';
                    if (type === 'error') {
                        warningElement.style.display = 'block';
                        messageElement.textContent = message;
                        setTimeout(() => {
                            warningElement.style.display = 'none';
                        }, 5000);
                    } else if (type === 'success') {
                        successElement.style.display = 'block';
                        setTimeout(() => {
                            successElement.style.display = 'none';
                        }, 3000);
                    }
                } else {
                    console.error('Some elements not found for fieldType:', fieldType);
                }
            }

            if (seoImageInput) {
                console.log('SEO Image input found, adding event listener');
                seoImageInput.addEventListener('change', function(e) {
                    console.log('SEO Image change event triggered');
                    const file = e.target.files[0];
                    if (file) {
                        console.log('File selected:', {
                            name: file.name,
                            size: file.size,
                            type: file.type
                        });
                        const validation = validateImageFile(file, 'seo');
                        console.log('Validation result:', validation);

                        if (!validation.isValidType) {
                            console.log('File type invalid, showing error');
                            showValidationMessage('seo', 'Only JPEG/PNG images are allowed.', 'error');
                            this.value = ''; 
                            const previewContainer = document.getElementById('seo_img_preview_container');
                            if (previewContainer) {
                                previewContainer.innerHTML = '';
                            }
                        } else if (!validation.isValidSize) {
                            console.log('File size invalid, showing error');
                            showValidationMessage('seo', 'Image greater than 2 mb', 'error');
                            this.value = ''; 
                            const previewContainer = document.getElementById('seo_img_preview_container');
                            if (previewContainer) {
                                previewContainer.innerHTML = '';
                            }
                        } else {
                            const tempImg = new Image();
                            tempImg.onload = function() {
                                console.log('SEO Image loaded, dimensions:', this.width, 'x', this
                                    .height);

                                if (this.width !== 1000 || this.height !== 1000) {
                                    console.log('SEO Image dimensions invalid, showing error');
                                    showValidationMessage('seo',
                                        `SEO image dimensions must be exactly 1000x1000 pixels. Current dimensions: ${this.width}x${this.height}px`,
                                        'error');
                                    seoImageInput.value = ''; 
                                    const previewContainer = document.getElementById(
                                        'seo_img_preview_container');
                                    if (previewContainer) {
                                        previewContainer.innerHTML = '';
                                    }
                                    return;
                                }

                                console.log('SEO Image dimensions valid, showing success');
                                showValidationMessage('seo', '', 'success');

                                const previewContainer = document.getElementById(
                                    'seo_img_preview_container');
                                if (previewContainer) {
                                    previewContainer.innerHTML = '';
                                    const wrapper = document.createElement('div');
                                    wrapper.className = 'position-relative d-inline-block';
                                    const img = document.createElement('img');
                                    img.style.maxWidth = '200px';
                                    img.style.maxHeight = '120px';
                                    img.style.border = '1px solid #ccc';
                                    img.alt = 'SEO Image Preview';
                                    const btn = document.createElement('button');
                                    btn.textContent = '×';
                                    btn.className = 'btn btn-danger btn-sm position-absolute';
                                    btn.style.top = '0';
                                    btn.style.right = '0';
                                    btn.onclick = removeSeoImage;
                                    wrapper.appendChild(img);
                                    wrapper.appendChild(btn);
                                    previewContainer.appendChild(wrapper);
                                    const reader = new FileReader();
                                    reader.onload = function(e) {
                                        img.src = e.target.result;
                                    };
                                    reader.readAsDataURL(file);
                                }
                            };

                            tempImg.onerror = function() {
                                console.error('Error loading SEO image for dimension check');
                                showValidationMessage('seo',
                                    'Error loading image for dimension validation.', 'error');
                                seoImageInput.value = '';
                            };

                            const reader = new FileReader();
                            reader.onload = function(e) {
                                tempImg.src = e.target.result;
                            };
                            reader.readAsDataURL(file);
                        }
                    }
                });
            } else {
                console.error('SEO Image input not found');
            }

            if (videoThumbnailInput) {
                console.log('Video Thumbnail input found, adding event listener');
                videoThumbnailInput.addEventListener('change', function(e) {
                    console.log('Video Thumbnail change event triggered');
                    const file = e.target.files[0];
                    if (file) {
                        console.log('Video Thumbnail file selected:', {
                            name: file.name,
                            size: file.size,
                            sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                            type: file.type
                        });
                        const validation = validateImageFile(file, 'video-thumbnail');
                        console.log('Video Thumbnail validation result:', validation);

                        if (!validation.isValidType) {
                            console.log(
                                'Video Thumbnail file type invalid, showing error and clearing input');
                            showValidationMessage('video-thumbnail', 'Only JPEG/PNG images are allowed.',
                                'error');
                            this.value = '';
                            const previewContainer = document.getElementById(
                                'video_thumbnail_preview_container');
                            if (previewContainer) {
                                previewContainer.innerHTML = '';
                            }
                            console.log('Video Thumbnail input cleared after type validation failure');
                        } else if (!validation.isValidSize) {
                            console.log(
                                'Video Thumbnail file size invalid, showing error and clearing input');
                            showValidationMessage('video-thumbnail', 'Image greater than 2 mb', 'error');
                            this.value = '';
                            const previewContainer = document.getElementById(
                                'video_thumbnail_preview_container');
                            if (previewContainer) {
                                previewContainer.innerHTML = '';
                            }
                            console.log('Video Thumbnail input cleared after size validation failure');
                        } else {
                            console.log('Video Thumbnail file valid, checking dimensions...');

                            const tempImg = new Image();
                            tempImg.onload = function() {
                                console.log('Video Thumbnail loaded, dimensions:', this.width, 'x', this
                                    .height);
                                
                                if (this.width !== 1280 || this.height !== 720) {
                                    console.log('Video Thumbnail dimensions invalid, showing error');
                                    showValidationMessage('video-thumbnail',
                                        `Video thumbnail dimensions must be exactly 1280x720 pixels. Current dimensions: ${this.width}x${this.height}px`,
                                        'error');
                                    videoThumbnailInput.value = ''; 
                                    const previewContainer = document.getElementById(
                                        'video_thumbnail_preview_container');
                                    if (previewContainer) {
                                        previewContainer.innerHTML = '';
                                    }
                                    return;
                                }

                                console.log('Video Thumbnail dimensions valid, showing success');
                                showValidationMessage('video-thumbnail', '', 'success');

                                const previewContainer = document.getElementById(
                                    'video_thumbnail_preview_container');
                                if (previewContainer) {
                                    previewContainer.innerHTML = '';
                                    const wrapper = document.createElement('div');
                                    wrapper.className = 'position-relative d-inline-block';
                                    const img = document.createElement('img');
                                    img.style.maxWidth = '200px';
                                    img.style.maxHeight = '120px';
                                    img.style.border = '1px solid #ccc';
                                    img.alt = 'Preview image';
                                    const btn = document.createElement('button');
                                    btn.textContent = '×';
                                    btn.className = 'btn btn-danger btn-sm position-absolute';
                                    btn.style.top = '0';
                                    btn.style.right = '0';
                                    btn.onclick = removeVideoThumbnail;
                                    wrapper.appendChild(img);
                                    wrapper.appendChild(btn);
                                    previewContainer.appendChild(wrapper);
                                    const reader = new FileReader();
                                    reader.onload = function(e) {
                                        img.src = e.target.result;
                                    };
                                    reader.readAsDataURL(file);
                                }
                            };

                            tempImg.onerror = function() {
                                console.error('Error loading Video Thumbnail for dimension check');
                                showValidationMessage('video-thumbnail',
                                    'Error loading image for dimension validation.', 'error');
                                videoThumbnailInput.value = '';
                            };

                            const reader = new FileReader();
                            reader.onload = function(e) {
                                tempImg.src = e.target.result;
                            };
                            reader.readAsDataURL(file);
                        }
                    }
                });
            } else {
                console.error('Video Thumbnail input not found');
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

        function removeVideoThumbnail() {
            const videoThumbnailInput = document.getElementById('video_thumbnail');
            const previewContainer = document.getElementById('video_thumbnail_preview_container');

            if (videoThumbnailInput) {
                videoThumbnailInput.value = ''; 
            }

            if (previewContainer) {
                previewContainer.innerHTML = '';
            }

            const videoThumbnailSuccessMessage = document.getElementById('video-thumbnail-success-message');
            if (videoThumbnailSuccessMessage) {
                videoThumbnailSuccessMessage.style.display = 'none';
            }

            console.log('Video thumbnail removed successfully');
        }

        function removeSeoImage() {
            const seoImageInput = document.getElementById('seo_img');
            const previewContainer = document.getElementById('seo_img_preview_container');

            if (seoImageInput) {
                seoImageInput.value = '';
            }

            if (previewContainer) {
                previewContainer.innerHTML = '';
            }

            const seoSuccessMessage = document.getElementById('seo-image-success-message');
            if (seoSuccessMessage) {
                seoSuccessMessage.style.display = 'none';
            }

            console.log('SEO image removed successfully');
        }

        // AJAX form submission — intercepts the native POST so the raw JSON error never shows
        document.getElementById('propertyForm').addEventListener('submit', function(e) {
            // Let existing validation listeners cancel the submit first
            if (e.defaultPrevented) return;
            e.preventDefault();

            const form = this;
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Submitting...';
            }

            const formData = new FormData(form);
            console.log('=== PROPERTY FORM SUBMIT DEBUG ===');
            for (const [key, value] of formData.entries()) {
                console.log('FIELD:', key, '=', value);
            }

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            })
            .then(function(response) {
                console.log('=== SERVER RESPONSE ===');
                console.log('HTTP Status:', response.status, response.statusText);
                const cloned = response.clone();
                return cloned.text().then(function(rawText) {
                    console.log('Raw response body:', rawText);
                    try {
                        const data = JSON.parse(rawText);
                        return { status: response.status, data: data };
                    } catch(parseErr) {
                        console.error('JSON parse error:', parseErr);
                        console.error('Non-JSON response:', rawText);
                        return { status: response.status, data: { success: false, message: 'Server returned non-JSON response. Check console for details.' } };
                    }
                });
            })
            .then(function({ status, data }) {
                console.log('Parsed response data:', data);
                if (data.success === true) {
                    showFormToast(data.message || 'Property created successfully!', 'success');
                    setTimeout(function() {
                        window.location.href = '{{ route("dashboard.section", ["type" => "properties"]) }}';
                    }, 1500);
                } else {
                    console.error('Server returned failure:', data);
                    const msg = data.errors
                        ? Object.values(data.errors).flat().join('<br>')
                        : (data.message || 'Something went wrong. Please try again.');
                    showFormToast(msg, 'error');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                }
            })
            .catch(function(err) {
                console.error('=== FETCH CATCH ERROR ===', err);
                showFormToast('Something went wrong. Please try again.', 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            });
        });

        function showFormToast(message, type) {
            const existing = document.getElementById('form-submit-toast');
            if (existing) existing.remove();

            const bg = type === 'success' ? '#d1e7dd' : '#f8d7da';
            const color = type === 'success' ? '#0f5132' : '#842029';
            const toast = document.createElement('div');
            toast.id = 'form-submit-toast';
            toast.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;min-width:280px;max-width:420px;padding:14px 18px;border-radius:8px;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.15);display:flex;align-items:flex-start;gap:10px;';
            toast.style.backgroundColor = bg;
            toast.style.color = color;
            toast.innerHTML = `<span style="flex:1">${message}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;font-size:18px;line-height:1;cursor:pointer;color:inherit;padding:0;margin-left:8px;">&times;</button>`;
            document.body.appendChild(toast);

            if (type === 'success') {
                setTimeout(function() { if (toast.parentElement) toast.remove(); }, 4000);
            }
        }
    </script>

@endsection
