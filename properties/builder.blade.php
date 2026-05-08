@extends('website.layouts.app')
@section('head')

    <style>
         body{
            margin: -1px !important;
        }
        .wishlist-toggle {
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0;
            font-size: 1.5rem;
        }
        .wishlist-toggle i {
            transition: color 0.3s ease;
        }

        label {
            display: inline-block;
            color: #5c6368;
        }

        .fa-crosshairs {
            color: #010101c7;
        }

        .row {
            margin-right: -15px;
            margin-left: -15px;
            margin-bottom: 0px;
        }

        .form-control:focus {
            box-shadow: 0 0 0 .25rem rgb(13 110 253 / 0%);
        }
        
        /* Dropdown styling for autocomplete */
        .dropdown-menu {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .dropdown-item {
            padding: 8px 12px;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .dropdown-item:hover {
            background-color: #f8f9fa;
        }
        
        .dropdown-item.disabled {
            color: #6c757d;
            cursor: not-allowed;
        }

        .nav-tabs .nav-link {
            margin-bottom: calc(-1 * var(--bs-nav-tabs-border-width));
            border: var(--bs-nav-tabs-border-width) solid transparent;
            border-top-left-radius: var(--bs-nav-tabs-border-radius);
            border-top-right-radius: var(--bs-nav-tabs-border-radius);
            background-color: hsla(0, 0%, 100%, .1);
            color: white;
        }

        .input-group .btn {
            position: relative;
            z-index: 2;
            height: 100%;
        }

        .search-st {
            width: 100%;
            margin-top: -80px;
        }

         .search-btn {
            background-color: #153e75 !important;
            border-color: #153e75 !important;
            color: #fff !important;
        }

        .roundedbottom {
            border-radius: 16px;
            box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px !important;
        }

        .nav-tabs {
            border-bottom: 0px !important;
        }

        .form-select {
            border: 0px solid #dee2e600 !important;
        }

        .beadroomselect {
            border: 1px solid #c4c4c4f7 !important;

        }

        .form-controla {
            border: 0px solid #dee2e600 !important;

        }

        input::placeholder {
            opacity: 1.5;

            color: black !important;
        }

        .form-select {
            color: black !important;
        }

        .rightsideborder {
            border-right: 1px solid #d9d9d9;
        }

        li.nav-item {
            margin-left: 0.5%;
        }

        .nav-tabs .nav-link {
            width: 130px;
            text-align: center;
            font-size: 17px;
            font-weight: 600;
            padding: 10%;
        }

        .buttongroup {
            height: 45px;
        }

        .feature-item {
            background-color: #7b7b7b14;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            border: 1px solid #7b7b7b14;
        }

        /* Custom Property Card Design */
        .custom-property-card {
            margin-bottom: 30px;
        }
        
        .property-card-wrapper {
            background: white;
            /* border-radius: 15px; */
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            width: 100%;
            height: 100%;
        }
        
        .property-card-wrapper:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }
        
        .property-image-container {
            position: relative;
            height: 280px;
            overflow: hidden;
            width: 100%;
            padding: 12px;
        }
        
        .property-image {
            position: relative;
            width: 100% !important;
            height: 100% !important;
            display: block;
            border-radius: 15px;
            overflow: hidden;
        }
        
        .property-image img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            transition: transform 0.3s ease;
            display: block;
            border-radius: 15px;
        }
        
        .property-card-wrapper:hover .property-image img {
            transform: scale(1.05);
        }
        
        .property-overlay-top {
            position: absolute;
            top: 15px;
            left: 15px;
            right: 15px;
            z-index: 10;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .property-tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        
        .property-type-tag {
            background: #dbeafe;
            color: #1e40af;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
        }
        
        .property-wishlist-btn {
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .property-wishlist-btn:hover {
            background: rgba(255, 255, 255, 1);
        }
        
        .property-overlay-bottom {
            position: absolute;
            bottom: 15px;
            left: 15px;
            z-index: 10;
        }
        
        .property-category-tag {
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            padding: 0px 12px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            display: inline-block;
            backdrop-filter: blur(5px);
        }
        
        .property-link {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 5;
        }
        
        .property-details {
            position: relative;
            margin-top: -30px;
            z-index: 20;
        }
        
        .property-info {
            /* background: white; */
            padding: 20px;
            border-radius: 15px 15px 0 0;
        }
        
        .property-specs {
            margin-bottom: 15px;
        }
        
        .property-specs .row {
            margin: 0;
        }
        
        .property-specs .col-3,
        .property-specs .col-4,
        .property-specs .col-12 {
            padding: 0 5px;
            font-size: 12px;
            font-weight: 600;
            color: #666;
        }
        
        .property-title {
            font-size: 20px;
            font-weight: 600;
            color: #000;
            margin-bottom: 10px;
            line-height: 1.3;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .property-location {
            color: #666;
            font-size: 14px;
            margin-bottom: 12px;
        }
        
        .property-location i {
            color: #007bff;
            margin-right: 5px;
        }
        
        .property-features {
            margin-bottom: 15px;
        }
        
        .property-features .feature-item {
            background: #f8f9fa;
            color: #007bff;
            padding: 0px 8px;
            border-radius: 4px;
            font-size: 12px;
            margin-right: 5px;
            margin-bottom: 5px;
            display: inline-block;
            border: 1px solid #e9ecef;
        }
        
        .property-divider {
            margin: 15px 0;
            border-color: #c3c3c3;
            border-width: 2px;
        }
        
        .property-price {
            font-size: 20px;
            font-weight: 700;
            /* color: #007bff; */
            margin: 0;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .property-image-container {
                height: 250px;
            }
            
            .property-details {
                margin-top: -30px;
            }
            
            .property-info {
                padding: 15px;
            }
            
            .property-title {
                font-size: 18px;
                color: #000;
            }
            
            .property-price {
                font-size: 18px;
            }
        }
        
        @media (max-width: 576px) {
            .property-image-container {
                height: 220px;
            }
            
            .property-details {
                margin-top: -30px;
            }
            
            .property-info {
                padding: 15px;
            }
            
            .property-title {
                font-size: 15px;
                color: #000;
            }
            
            .property-price {
                font-size: 16px;
            }
            
            .property-overlay-top,
            .property-overlay-bottom {
                padding: 0px;
            }
        }
        
        @media (max-width: 480px) {
            .property-image-container {
                height: 250px;
            }
            
            .property-details {
                margin-top: -25px;
            }
        }

        @media only screen and (max-width: 600px) {

            /* .nav-tabs {
                margin-top: -60% !important;

            } */

            .rightsideborder {
                padding: 3%;
            }

            .form-select {
                border: 1px solid #dee2e6 !important;
                line-height: 2.5rem !important;
            }

            .form-control {
                border: 1px solid #dee2e6 !important;
                line-height: 2.5rem !important;
            }

            .input-group-append {
                border: 1px solid #dee2e6 !important;
            }

            li.nav-item {
                margin-left: 3.5%;
            }

            .buttongroup {
                height: 54px;
            }
        }


        .topupvideo {
            margin-top: -10% !important;
            z-index: 1000;
        }

        .project-item {
            position: relative;
            height: 100%;
            margin-bottom: 30px;
            border-radius: 16px;
        }

        .our-project .project-featured-image {
            position: relative;
            overflow: hidden;
            border-radius: 15px;
        }

        .our-project {
            padding: 50px 0 70px;
        }

        .content-project {
            background: white;
            text-align: left;
            margin-top: -8%;
        }

        .form-label,
        .form-control.form-controla {
            padding-left: 0.75rem; /* adjust to match */
        }

    </style>
    <div class="page-header parallaxie">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <!-- Page Header Box Start -->
                    <div class="page-header-box">
                        <h1><span class="animated-text"><span class="selected-city-name"></span> Builder Properties</span>
                        </h1><br>
                        <nav class="wow fadeInUp">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="{{ route('index') }}">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Builder-Properties</li>
                            </ol>
                        </nav>
                    </div>
                    <!-- Page Header Box End -->
                </div>
            </div>
        </div>
    </div>
@endsection
@section('styles')
    <style>
        .project-featured-image a[data-cursor-text] {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: none;
            z-index: 10;
        }

        .project-featured-image:hover a[data-cursor-text] {
            display: block;
        }

        .page-header {
            background: url("{{ asset('assets/images/footer/owner_image.png')}}");
        }

        .paginationtext .page-item .text {
            font-weight: 500;
            padding: 0.5rem 1rem;
            display: inline-block;
        }

        .paginationtext {
            display: flex;
            margin-top: 20px;
            font-size: 110%;
            font-weight: 600;
            margin-left: 23%;
        }

        @media (max-width: 767px) {
            .paginationtext {
                margin-left: 12%;
            }
        }
    </style>
@endsection
@section('content')
    <div class="row">
        <div class="container search-st" style="z-index: 0;">
            <div class="row align-items-center">
                <div class="col-lg-12">
                    <div class="hero-content">
                        <div class="search-wrapper">
                            <div class="container mt-5">
                                <!-- Tabs -->
                                    <!-- <ul class="nav nav-tabs justify-content-center" id="propertyTab" role="tablist">
                                        <li class="nav-item">
                                            <a class="nav-link active" id="rent-tab" data-toggle="tab" href="#rent" role="tab">For Rent</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" id="sale-tab" data-toggle="tab" href="#sale" role="tab">For Sale</a>
                                        </li>
                                    </ul> -->
                                <!-- Tabs colsed -->
                                <!-- Search Box -->
                                <div class="bg-white p-3 roundedbottom shadow-sm"
                                     style="box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px !important;">
                                    <form class="form-row align-items-center row">
                                        <div class="col-md-2 rightsideborder mb-2 form-group-3 form-style">
                                            <label class="form-label">City</label>
                                            <select class="form-select" name="city" id="citySelect">
                                                <option value="0">Select City</option>
                                                @foreach ($city as $cities)
                                                    <option
                                                        value="{{ $cities->id }}" {{ $cities->id == 7063 ? 'selected' : '' }}>
                                                        {{ $cities->name }}
                                                    </option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <!--<div class="col-md-2 rightsideborder mb-2">-->
                                        <!--    <label class="form-label">Keyword</label>-->
                                        <!--    <input type="text" class="form-control form-controla" name="keyword"-->
                                        <!--           placeholder="Search for Keyword">-->
                                        <!--</div>-->
                                        <div class="col-md-2 rightsideborder mb-2">
                                            <label class="form-label" style="padding-left: 0.5rem;">Keyword</label>
                                            <div class="input-group" style="position: relative;">
                                                <input type="text" id="keywordInput" class="form-control form-controla" name="keyword" placeholder="Search for Keyword" style="padding-left: 0.5rem;" autocomplete="off">
                                                <div id="keywordList" class="dropdown-menu" style="display: none; position: absolute; z-index: 1000; left:0; top:100%; width:100%;"></div>
                                            </div>
                                        </div>
                                        <div class="col-md-3 rightsideborder mb-2">
                                            <label class="form-label">Location</label>
                                            <div class="input-group" style="position: relative;">
                                                <input type="text" id="locationInput" name="location" class="form-control form-controla"
                                                       placeholder="Enter Location" autocomplete="off">
                                               <div id="locationList" class="dropdown-menu" style="display: none; position: absolute; z-index: 1000; left:0; top:100%; width:100%;"></div> 
                                                       {{-- <div class="input-group-append">
                                                    <button class="btn btn-outline-secondary" style="border:0px solid"
                                                            type="button">
                                                        <i class="fas fa-crosshairs"></i>
                                                    </button>
                                                </div> --}}
                                            </div>
                                        </div>
                                        <div class="col-md-2 rightsideborder mb-2">
                                            <label class="form-label">Category</label>
                                            <select class="form-select" name="category" id="category">
                                                <option value="">Select Category</option>
                                                @foreach ($category as $categories)
                                                    <option
                                                        value="{{ $categories->id }}">{{ $categories->name }}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <div class="col-md-3  mb-2">
                                            <div class="d-flex gap-2 buttongroup">
                                                <button style="    border: 0.2px solid #80808040;"
                                                        class="btn btn-outline-dark w-50 toggle-advanced-filter">
                                                    <i class="fas fa-sliders-h"></i> Advanced
                                                </button>
                                                <button class="btn btn-primary w-50 search-btn"><i class="fa fa-search"></i>
                                                    Search
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <div id="advancedFilters" class="  rounded-4 advance-filt   mt-3"
                                                 style="display: none;">
                                                <div class="row gy-4 align-items-center">
                                                    <!-- Price & Square Range -->
                                                    <div class="col-md-6">
                                                        <label class="form-label  ">
                                                            Price Range &nbsp;
                                                            <span class="fw-normal">from</span> ₹<span
                                                                id="priceFromText">0</span>
                                                            <span class="fw-normal">to</span> ₹<span
                                                                id="priceToText">0</span>
                                                        </label>
                                                        <input type="text" id="priceRangeSlider" name="price_range"/>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label class="form-label ">
                                                            Square Range &nbsp;
                                                            <span class="fw-normal">from</span> <span
                                                                id="squareFromText"></span>
                                                            <span class="fw-normal">to</span><span id="squareToText"></span>
                                                        </label>
                                                        <input type="text" id="squareRangeSlider" name="square_range"/>
                                                    </div>
                                                    <!-- Bedroom / Bathroom / Floor -->
                                                     <!-- Bedroom / Bathroom / Floor -->
                                                     <div class="row" id="room-filters-row">
                                                        <div class="col-md-4">
                                                            <label class="form-label">Bathrooms</label>
                                                            <select class="form-select" name="bathrooms" style="border: 1px solid #ced4da !important; border-radius: 0.375rem !important; padding: 0.375rem 0.75rem !important;">
                                                                <option value="">All</option>
                                                                <option value="1">1 Bathroom</option>
                                                                <option value="2">2 Bathrooms</option>
                                                                <option value="3">3 Bathrooms</option>
                                                                <option value="4">4 Bathrooms</option>
                                                                <option value="5+">5+ Bathrooms</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <label class="form-label">Bedrooms</label>
                                                            <select class="form-select" name="bedrooms" style="border: 1px solid #ced4da !important; border-radius: 0.375rem !important; padding: 0.375rem 0.75rem !important;">
                                                                <option value="">All</option>
                                                                <option value="1">1 Bedroom</option>
                                                                <option value="2">2 Bedrooms</option>
                                                                <option value="3">3 Bedrooms</option>
                                                                <option value="4">4 Bedrooms</option>
                                                                <option value="5+">5+ Bedrooms</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <label class="form-label">Floors</label>
                                                            <select class="form-select" name="floors" style="border: 1px solid #ced4da !important; border-radius: 0.375rem !important; padding: 0.375rem 0.75rem !important;">
                                                                <option value="">All</option>
                                                                <option value="1">1 Floor</option>
                                                                <option value="2">2 Floor</option>
                                                                <option value="3">3 Floor</option>
                                                                <option value="4">4 Floor</option>
                                                                <option value="5">5 Floor</option>
                                                                <option value="6">6 Floor</option>
                                                                <option value="7">7 Floor</option>
                                                                <option value="8">8 Floor</option>
                                                                <option value="9">9 Floor</option>
                                                                <option value="10">10 Floor</option>
                                                            </select>
                                                        </div>
                                                    </div>  
                                                    <input type="hidden" id="owner_type" name="owner_type" value="owner">
                                                    <div class="row mt-4">
                                                        @foreach ($amenities as $amenity)
                                                            <div class="col-md-2 mb-2">
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="checkbox"
                                                                           value="{{ $amenity->keyfeatures_name }}"
                                                                           name="amenities[]"
                                                                           id="amenity-{{ $amenity->keyid }}">
                                                                    <label
                                                                        class="form-check-label small text-muted fw-semibold"
                                                                        for="amenity-{{ $amenity->keyid }}">
                                                                        {{ $amenity->keyfeatures_name ?? '-' }}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        @endforeach
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div class="our-project">
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <div class="our-Project-nav wow fadeInUp" data-wow-delay="0.4s">
                                                    {{-- <ul>
                                                        <li><a href="#" class="active-btn" data-filter="*">All</a></li>
                                                        <li><a href="#" data-filter=".cat-3">Plots</a></li>
                                                        <li><a href="#" data-filter=".cat-1">Apartment</a></li>
                                                        <li><a href="#" data-filter=".cat-2">Villa</a></li>
                                                        <li><a href="#" data-filter=".cat-4">House</a></li>
                                                        <li><a href="#" data-filter=".cat-5">Land</a></li>
                                                        <li><a href="#" data-filter=".cat-6">Commercial Property</a>
                                                        </li>
                                                    </ul> --}}
                                                    <ul>
                                                        <li><a href="#" class="active-btn" onclick="loadCityAndCategoryProjects(selectedCityId, null)">All</a></li>
                                                        <li><a href="#" onclick="loadCityAndCategoryProjects(selectedCityId, 3)">Plots</a></li>
                                                        <li><a href="#" onclick="loadCityAndCategoryProjects(selectedCityId, 1)">Apartments</a></li>
                                                        <li><a href="#" onclick="loadCityAndCategoryProjects(selectedCityId, 2)">Villas</a></li>
                                                        <li><a href="#" onclick="loadCityAndCategoryProjects(selectedCityId, 4)">Individual House</a></li>
                                                        <li><a href="#" onclick="loadCityAndCategoryProjects(selectedCityId, 6)">Commercial Property</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="col-lg-12">
                                                <div class="row " id="property-list">
                                                </div>
                                            </div>
                                            <div class="col-lg-12">
                                                <ul class="paginationtext mt-4"></ul>
                                            </div>
                                            <div class="col-lg-12">
                                                <div class="row justify-content-center">
                                                    <div class="col-lg-12">
                                                        <ul class="pagination justify-content-center mt-4"></ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
@section('scripts')
    <script>
        
         $(document).ready(function () {
            $('#locationInput').on('keyup', function () {
                let query = $(this).val();
                let cityId = $('#citySelect').val();

                if (query.length >= 2 && cityId) {
                    $.ajax({
                        url: "{{ route('locations.autocomplete') }}",
                        type: "GET",
                        data: {
                            search: query,
                            city: cityId
                        },
                        success: function (data) {
                            let dropdown = $('#locationList');
                            dropdown.empty().show();

                            if (data.length > 0) {
                                data.forEach(function (item) {
                                    dropdown.append('<a href="#" class="dropdown-item location-item">' + item.location + '</a>');
                                });
                            } else {
                                dropdown.append('<a href="#" class="dropdown-item disabled">No results</a>');
                            }
                        }
                    });
                } else {
                    $('#locationList').hide();
                }
            });

            // When a location is selected from the dropdown
            $(document).on('click', '.location-item', function (e) {
                e.preventDefault();
                $('#locationInput').val($(this).text());
                $('#locationList').hide();
            });
            
            // Keyword autocomplete
            $('#keywordInput').on('keyup', function () {
                let query = $(this).val();

                if (query.length >= 2) {
                    $.ajax({
                        url: "{{ route('keywords.autocomplete') }}",
                        type: "GET",
                        data: {
                            search: query
                        },
                        success: function (data) {
                            let dropdown = $('#keywordList');
                            dropdown.empty().show();

                            if (data.length > 0) {
                                data.forEach(function (item) {
                                    dropdown.append('<a href="#" class="dropdown-item keyword-item">' + item + '</a>');
                                });
                            } else {
                                dropdown.append('<a href="#" class="dropdown-item disabled">No results</a>');
                            }
                        }
                    });
                } else {
                    $('#keywordList').hide();
                }
            });

            // When a keyword is selected from the dropdown
            $(document).on('click', '.keyword-item', function (e) {
                e.preventDefault();
                $('#keywordInput').val($(this).text());
                $('#keywordList').hide();
            });
            
        });
        function setCookie(name, value, days) {
            try {
                let expires = "";
                if (days) {
                    const date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = "; expires=" + date.toUTCString();
                }
                document.cookie = `${name}=${encodeURIComponent(value || "")}${expires}; path=/; SameSite=Lax`;
                console.log(`Cookie set: ${name}=${value}`);
            } catch (e) {
                console.error("Error setting cookie:", e);
            }
        }

        function getCookie(name) {
            try {
                const nameEQ = name + "=";
                const ca = document.cookie.split(';');
                for (let c of ca) {
                    c = c.trim();
                    if (c.indexOf(nameEQ) === 0) {
                        const value = decodeURIComponent(c.substring(nameEQ.length));
                        console.log(`Cookie retrieved: ${name}=${value}`);
                        return value;
                    }
                }
                console.log(`Cookie not found: ${name}`);
                return null;
            } catch (e) {
                console.error("Error getting cookie:", e);
                return null;
            }
        }

        function fetchCityName(cityId, callback) {
            console.log(`Fetching city name for cityId: ${cityId}`);
            $.ajax({
                url: '/getCityName/' + cityId,
                method: 'GET',
                success: function (response) {
                    const cityName = response.name || 'Unknown City';
                    console.log(`City name fetched: ${cityName}`);
                    callback(cityName);
                },
                error: function (xhr, status, error) {
                    console.error(`Failed to fetch city name: ${status} - ${error}`, xhr.responseText);
                    callback('Unknown City');
                }
            });
        }

        function updateCityNameDisplay(cityName) {
            try {
                const displayName = cityName || 'Unknown City';
                $('.selected-city-name').text(`${displayName}`);
                $('#property-list').css('height', '');
                console.log(`City name updated: ${displayName}`);
            } catch (e) {
                console.error("Error updating city name:", e);
            }
        }

        function filterHandler() {
            try {
                $('.our-Project-nav a').off('click').on('click', function (e) {
                    e.preventDefault();
                    $('.our-Project-nav a').removeClass('active-btn');
                    $(this).addClass('active-btn');

                    $('#property-list').css('height', '');
                    const filterValue = $(this).data('filter');

                    let $filteredItems;

                    if (filterValue === '*') {
                        $('.custom-property-card').show();
                        $filteredItems = $('.custom-property-card'); // all items
                    } else {
                        $('.custom-property-card').hide();
                        $filteredItems = $(`.custom-property-card${filterValue}`); // filtered items
                        $filteredItems.show();
                    }

                    console.log(`Filter applied: ${filterValue}`);

                    // Apply pagination to filtered items
                    pagination($filteredItems);
                });
            } catch (e) {
                console.error("Error in filter handler:", e);
            }
        }

        window.wishlistIds = @json($wishlistIds);
        function renderProperties(properties) {
            try {
                $('#property-list').empty();
                if (!properties || !Array.isArray(properties)) {
                    console.error("Invalid properties data:", properties);
                    return;
                }
                // Define a mapping for unit IDs to unit names
                const unitMap = {
                    1: 'Sq. Ft',
                    2: 'Sq. Inches',
                    3: 'Acres',
                    4: 'Cents',
                    5: 'Sq. Meters',
                    6: 'Sq. Yards',
                    7: 'Hectares'
                };
                    $.each(properties, function (index, property) {
                        const id = property.id;
                        const permalink = property.permalink || '';
                        const baseUrl = "{{ url('projects/details') }}";
                        const url = permalink 
                            ? `${baseUrl}/${id}/${encodeURIComponent(permalink)}`
                            : `${baseUrl}/${id}`;
                        const isInWishlist = wishlistIds.some(wid => Number(wid) === Number(id));
                        const wishlistIcon = isInWishlist
                            ? '<i class="fas fa-heart text-red-500" style="color: red;"></i>'
                            : '<i class="far fa-heart"></i>';
                        const wishlistData = isInWishlist ? '1' : '0';
                        const categoryClass = property.category_id ? `cat-${property.category_id}` : '';
                        const image = property.image_url || '/assets/default.png';
                        const name = property.name || 'No Name';
                        const city = property.city || '';
                        const state = property.state || '';
                         const location = property.location || '';
                        const total_bedrooms = property.total_bedrooms || '0';
                        const total_bathrooms = property.total_bathrooms || '0';
                        const sqft = property.area_total ||'';
                        const areaUnitString = unitMap[property.unit] || ''; 
                        const featured = property.is_featured
                            ? '<span class="flag-tag success">Featured</span>'
                            : '';
                        console.log('featured',featured);
                        const description = property.description || 'No Description';
                        const direction_facing = property.direction_facing|| 'No Direction Facing';
                        const price = property.price
                            ? new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                maximumFractionDigits: 0,
                            }).format(property.price)
                            : 'N/A';
                        const categoryName = property.category_name || '';
                        const categoryId = property.category_id || '';
                        const type = property.owner_type || '';
                        const features = property.feature || [];

                        // ✅ Updated Features Block
                            let featuresList = '';
                            if (features.length > 0) {
                                featuresList = features.slice(0, 3).map(feature => `
                                    <span class="feature-item" style="font-weight: bold; display: inline-flex; align-items: center; margin-right: 8px;">
                                        <img src="${feature.icon}" alt="${feature.name}" style="width: 16px; height: 16px; margin-right: 4px;" />
                                        ${feature.name}
                                    </span>
                                `).join('');
                            } else {
                                featuresList = `<span class="feature-item" style="font-weight: bold; display: inline-block; color: #28a745;">Excellent amenities included</span>`;
                            }
                            let icons = '';
                            // Helper: Check if custom_fields has a "plot area" field (for land/plots)
                            let isLandOrPlot = false;
                            if (property.custom_fields && Array.isArray(property.custom_fields)) {
                                isLandOrPlot = property.custom_fields.some(f =>
                                    f.field_name && f.field_name.toLowerCase().includes('plot area')
                                );
                            }

                            // For Commercial Property (6), try to detect subcategory
                            let commercialSubcategory = '';
                            if (categoryId == 6 && property.custom_fields && Array.isArray(property.custom_fields)) {
                                // If has plot area, it's land
                                if (isLandOrPlot) {
                                    commercialSubcategory = 'land';
                                } else {
                                    // If not land, default to shop/building (you can improve this if you have more info)
                                    commercialSubcategory = 'shop_or_building';
                                }
                            }

                            // Logic for icons
                            if (categoryId == 1 || categoryId == 2 || categoryId == 4) {
                                // Apartment, Villa, House: show both
                                icons = `
                                    <div class="row">
                                        <div class="col-3"><b style="font-size: 14px; font-weight: 500; color: #000;"><i class="fa fa-bed"></i> ${total_bedrooms}</b></div>
                                        <div class="col-3"><b style="font-size: 14px; font-weight: 500; color: #000;"><i class="fa fa-bath"></i> ${total_bathrooms}</b></div>
                                        <div class="col-6"><b style="font-size: 14px; font-weight: 500; color: #000;"><i class="fa fa-ruler"></i> ${sqft} ${areaUnitString}</b></div>
                                    </div>
                                `;
                            } else if (categoryId == 3 || (categoryId == 6 && commercialSubcategory === 'land')) {
                                // Plots or Commercial > Land: show direction facing
                                icons = `
                                    <div class="row">
                                        <div class="col-3"><b style="font-size: 14px; font-weight: 500; color: #000;"><i class="fa fa-compass"></i> ${direction_facing}</b></div>
                                        <div class="col-8"><b style="font-size: 14px; font-weight: 500; color: #000;"><i class="fa fa-ruler"></i> ${sqft} ${areaUnitString}</b></div>
                                    </div>
                                `;
                            } else if (categoryId == 6 && commercialSubcategory === 'shop_or_building') {
                                // Commercial > Shop/Building: show only bathrooms
                                icons = `
                                    <div class="row">
                                        
                                        <div class="col-3"><b style="font-size: 14px; font-weight: 500; color: #000;"><i class="fa fa-bath"></i> ${total_bathrooms}</b></div>
                                        <div class="col-4"><b style="font-size: 14px; font-weight: 500; color: #000;"><i class="fa fa-ruler"></i> ${sqft} ${areaUnitString}</b></div>
                                    </div>
                                `;
                            }

                        $('#property-list').append(`
                        <div class="col-lg-4 col-md-6 col-sm-6 col-12 custom-property-card ${categoryClass}" data-url="${url}">
                            <div class="property-card-wrapper">
                                <div class="property-image-container image-anime">
                                    <div class="property-image">
                                        <img src="${image}" alt="${name}">
                                        <a href="${url}" class="property-link"></a>
                                        
                                        <div class="property-overlay-top">
                                            <div class="property-tags">
                                                ${featured}
                                                <span class="property-type-tag">${type}</span>
                                            </div>
                                            <button class="property-wishlist-btn" data-id="${id}" data-in-wishlist="${wishlistData}">
                                                ${wishlistIcon}
                                            </button>
                                        </div>
                                        
                                        <div class="property-overlay-bottom">
                                            <span class="property-category-tag">${categoryName}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="property-details">
                                    <div class="property-info">
                                        <div class="property-specs">
                                            ${icons}
                                        </div>
                                        <h5 class="property-title">${name}</h5>
                                        <div class="property-location">
                                            <i class="fas fa-map-marker-alt"></i>
                                            <span>${location}</span>
                                        </div>
                                        <div class="property-features">
                                            ${featuresList}
                                        </div>
                                        <hr class="property-divider">
                                        <div class="property-price">${price}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `);
                });
                console.log(`Properties rendered: ${properties.length}`);
            } catch (e) {
                console.error("Error rendering properties:", e);
            }
        }

        function loadprojects() {
            console.log('loading projects');
            $.ajax({
                    url: '/builder/properties',
                    method: 'GET',
                    success: function (response) {
                        if (response && Array.isArray(response.properties)) {
                            renderProperties(response.properties);
                            pagination();
                            paginationtext(1, 10, response.length);
                            filterHandler();
                            console.log(`Projects loaded: ${response.properties.length}`);
                        } else {
                            console.error("Invalid response format:", response);
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error(`Failed to load projects: ${status} - ${error}`, xhr.responseText);
                    }
            });
        }

        function loadCityProjects(cityId) {
            console.log(`Loading projects for cityId: ${cityId}`);
            $.ajax({
                url: '/builderprojects/filter/' + cityId,
                method: 'GET',
                success: function (projects) {
                    if (projects && Array.isArray(projects.properties)) {
                        renderProperties(projects.properties);
                        pagination();
                        paginationtext(1, 10, projects.properties.length);
                        filterHandler();
                        console.log(`Projects loaded: ${projects.properties.length}`);
                    } else {
                        console.error('Invalid project response format:', projects);
                    }
                },
                error: function (xhr, status, error) {
                    console.error(`Failed to load projects: ${status} - ${error}`, xhr.responseText);
                }
            });
        }

        function loadCityAndCategoryProjects(cityId, categoryId = null) {
            let url = '/builder/properties/search/?city=' + cityId;
            if (categoryId) {
                url += '&category=' + categoryId;
            }

            console.log(`Loading projects for cityId: ${cityId} and categoryId: ${categoryId || 'All'}`);

            $.ajax({
                url: url,
                method: 'GET',
                success: function (projects) {
                    if (projects && Array.isArray(projects.properties)) {
                        renderProperties(projects.properties);
                        filterHandler();
                        console.log(`Projects loaded: ${projects.properties.length}`);
                    } else {
                        console.error('Invalid project response format:', projects);
                    }
                },
                error: function (xhr, status, error) {
                        console.error(`Failed to load projects: ${status} - ${error}`, xhr.responseText);
                }
            });
        }

        function loadCustomFields(category_id) {
            if (!category_id) {
                $('#customFieldsContainer').empty();
                console.log("No category_id, cleared custom fields");
                return;
            }
            console.log(`Loading custom fields for category_id: ${category_id}`);
            $.ajax({
                url: '/getCustomFields/' + category_id,
                method: 'GET',
                dataType: 'json',
                success: function (response) {
                    $('#customFieldsContainer').empty();
                    if (response.success && response.fields && response.fields.length > 0) {
                        let fieldsHTML = '';
                        $.each(response.fields, function (index, field) {
                            const additionalFields = field.additional_fields || [];
                            if (field.field_type === 'text') {
                                fieldsHTML += `
                            <div class="col-md-3">
                                <label class="form-label">${field.field_label}</label>
                                <input type="text" class="form-control" name="[${field.field_label}]" ${field.is_required ? 'required' : ''}>
                            </div>
                        `;
                            } else if (field.field_type === 'radio' && field.radio_options) {
                                fieldsHTML += `
                            <div class="col-md-12">
                                <label class="form-label">${field.field_label ?? 'Select Type'}</label><br>
                                <div id="radio-group-${field.field_label}">
                                    ${field.radio_options.map(option => `
                                        <div class="form-check form-check-inline">
                                            <input type="radio" class="form-check-input radio-main-option" name="[${field.field_label}]" value="${option.name}" id="${field.field_label}_${option.name}" data-fields='${JSON.stringify(option.fields ?? [])}'>
                                            <label class="form-check-label" for="${field.field_label}_${option.name}">${option.name}</label>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div id="customFieldsDynamicContainer" class="row mt-3"></div>
                        `;
                            }
                            $.each(additionalFields, function (idx, optField) {
                                if (optField.type === 'text') {
                                    fieldsHTML += `
                                <div class="col-md-3">
                                    <label class="form-label">${optField.label}</label>
                                    <input type="text" class="form-control" name="[${optField.label}]" ${optField.required == '1' ? 'required' : ''}>
                                </div>
                            `;
                                } else if (optField.type === 'radio' && optField.radio_options) {
                                    fieldsHTML += `
                                <div class="col-md-3">
                                    <label class="form-label">${optField.label}</label>
                                    <div id="radio-group-${optField.label}">
                                        ${optField.radio_options.map(option => `
                                            <div class="form-check">
                                                <input type="radio" class="form-check-input" name="[${optField.label}]" value="${option.name}" id="${optField.label}_${option.name}">
                                                <label class="form-check-label" for="${optField.label}_${option.name}">${option.name}</label>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                                }
                            });
                        });
                        $('#customFieldsContainer').html(fieldsHTML);
                        $(document).off('change', '.radio-main-option').on('change', '.radio-main-option', function () {
                            let fields = $(this).data('fields');
                            console.log('Subfields for selected radio:', fields);
                            let dynamicFieldsHtml = '';
                            $.each(fields, function (i, field) {
                                if (field.type === 'text') {
                                    dynamicFieldsHtml += `
                                <div class="col-md-3">
                                    <label class="form-label">${field.label}</label>
                                    <input type="text" class="form-control" name="[${field.label}]" ${field.required == '1' ? 'required' : ''}>
                                </div>
                            `;
                                } else if (field.type === 'radio' && field.radio_options) {
                                    dynamicFieldsHtml += `
                                <div class="col-md-3">
                                    <label class="form-label">${field.label}</label>
                                    <div id="radio-group-${field.label}">
                                        ${field.radio_options.map(option => `
                                            <div class="form-check">
                                                <input type="radio" class="form-check-input" name="[${field.label}]" value="${option.name}" id="${field.label}_${option.name}">
                                                <label class="form-check-label" for="${field.label}_${option.name}">${option.name}</label>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                                }
                            });
                            $('#customFieldsDynamicContainer').html(dynamicFieldsHtml).hide().slideDown();
                            console.log("Dynamic fields updated for radio selection");
                        });
                        console.log(`Custom fields loaded: ${response.fields.length}`);
                    } else {
                        $('#customFieldsContainer').empty();
                        console.log("No custom fields available");
                    }
                },
                error: function (xhr, status, error) {
                    console.error(`Error loading custom fields: ${status} - ${error}`, xhr.responseText);
                    $('#customFieldsContainer').empty();
                }
            });
        }

        function collectCustomFieldsData() {
            try {
                const customFieldsData = {};
                $('#customFieldsContainer, #customFieldsDynamicContainer').find('input, select, textarea').each(function () {
                    const $field = $(this);
                    const name = $field.attr('name');
                    if (!name) return;
                    if ($field.is(':checkbox')) {
                        if ($field.is(':checked')) {
                            customFieldsData[name] = customFieldsData[name] || [];
                            customFieldsData[name].push($field.val());
                        }
                    } else if ($field.is(':radio')) {
                        if ($field.is(':checked')) {
                            customFieldsData[name] = $field.val();
                        }
                    } else {
                        const value = $field.val();
                        if (value !== null && value !== '') {
                            customFieldsData[name] = value;
                        }
                    }
                });
                const selectedAmenities = [];
                $('input[name="amenities[]"]:checked').each(function () {
                    selectedAmenities.push($(this).val());
                });
                if (selectedAmenities.length > 0) {
                    customFieldsData['amenities'] = selectedAmenities;
                }
                console.log("Collected custom fields data:", customFieldsData);
                return customFieldsData;
            } catch (e) {
                console.error("Error collecting custom fields:", e);
                return {};
            }
        }

        // Global variable for city ID
        let selectedCityId = '7063';

        $(document).ready(function () {
            console.log("Document ready started");
            const defaultCityId = '7063';
            //let selectedCityId = getCookie('selectedCityId') || defaultCityId;
            selectedCityId = getCookie('selectedCityId') || defaultCityId;
            // Make it globally accessible
            window.selectedCityId = selectedCityId;
            // Update city name display
            if ($('#citySelect').length) {
                $('#citySelect').val(selectedCityId);
                const selectedCityName = $('#citySelect option:selected').text() || 'Unknown City';
                updateCityNameDisplay(selectedCityName);
                console.log(`City select set to: ${selectedCityId}, name: ${selectedCityName}`);
            } else {
                console.log("No citySelect found, fetching city name");
                fetchCityName(selectedCityId, function (cityName) {
                    updateCityNameDisplay(cityName);
                });
            }
            // Load projects
            loadCityProjects(selectedCityId);
            $('#citySelect').change(function () {
                selectedCityId = $(this).val();
                setCookie('selectedCityId', selectedCityId, 7);
                const selectedCityName = $(this).find('option:selected').text() || 'Unknown City';
                updateCityNameDisplay(selectedCityName);
                console.log(`City changed to: ${selectedCityId}, name: ${selectedCityName}`);
                loadCityProjects(selectedCityId);
                header_title();

                // Update the global variable for navigation
                window.selectedCityId = selectedCityId;
            });
            $('.search-btn').on('click', function (e) {
                e.preventDefault();
                const form = $(this).closest('form');
                const data = {
                    type: form.data('owner_type') || null,
                    city: form.find('select[name="city"]').val() || null,
                    keyword: form.find('input[name="keyword"]').val() || null,
                    location: form.find('input[name="location"]').val() || null,
                    category: form.find('select[name="category"]').val() || null,
                    price_range: $('#priceRangeSlider').val() || null,
                    square_range: $('#squareRangeSlider').val() || null,
                    floor: form.find('select[name="floor"]').val() || null,
                    bedrooms: form.find('select[name="bedrooms"]').val() || null,
                    bathrooms: form.find('select[name="bathrooms"]').val() || null,
                    amenities: $('input[name="amenities[]"]:checked').map(function () {
                        return $(this).val();
                    }).get() || null,
                };
                Object.assign(data, collectCustomFieldsData());
                console.log('Search data:', data);
                $.ajax({
                    url: '/builder/properties/search',
                    method: 'GET',
                    data: data,
                    success: function (response) {
                        if (response && Array.isArray(response.properties)) {
                            renderProperties(response.properties);
                            paginationtext();
                            pagination();
                            filterHandler();
                            $('#property-list').removeAttr('style');
                            console.log("Search results loaded", response);
                        } else {
                            console.error('Invalid response format:', response);
                        }
                    },

                    error: function (xhr, status, error) {
                        console.error(`Search failed: ${status} - ${error}`, xhr.responseText);
                    }
                });
            });
            $('.search-btn').on('click', function () {
                $('#advancedFilters').slideUp(); // Collapse with animation
            });
            $('.toggle-advanced-filter').on('click', function (e) {
                e.preventDefault();
                $('#advancedFilters').slideToggle();
                console.log("Advanced filters toggled");
            });

            let priceFrom = {{ $priceFrom ?? 0 }};
            let priceTo = {{ $priceTo ?? 1000000000 }};

            $("#priceRangeSlider").ionRangeSlider({
                type: "double",
                min: 0,
                max: 1000000000,
                from: priceFrom,
                to: priceTo,
                step: 1000,
                prettify_enabled: true,
                prefix: "₹",
                prettify: function (num) {
                    if (num >= 10000000) {
                        return (num / 10000000).toFixed(2).replace(/\.00$/, '') + " Cr";
                    } else if (num >= 100000) {
                        return (num / 100000).toFixed(2).replace(/\.00$/, '') + " L";
                    } else if (num >= 1000) {
                        return (num / 1000).toFixed(2).replace(/\.00$/, '') + " K";
                    } else {
                        return num;
                    }
                },
                onStart: function (data) {
                    $('#priceFromText').text(formatInShortForm(data.from));
                    $('#priceToText').text(formatInShortForm(data.to));
                },
                onChange: function (data) {
                    $('#priceFromText').text(formatInShortForm(data.from));
                    $('#priceToText').text(formatInShortForm(data.to));
                }
            });
            $("#squareRangeSlider").ionRangeSlider({
                type: "double",
                min: 0,
                max: 100000,
                from: 0,
                to: 100000,
                step: 1,
                postfix: " sqft",
                hide_from_to: true,
                hide_min_max: true,
                onStart: function (data) {
                    $('#squareFromText').text(data.from);
                    $('#squareToText').text(data.to);
                },
                onChange: function (data) {
                    $('#squareFromText').text(data.from);
                    $('#squareToText').text(data.to);
                }
            });
            $('#category').change(function () {
                loadCustomFields($(this).val());
            });
            filterHandler();
            paginationtext();
            pagination();
            $('#property-list').removeAttr('style');
            console.log("Document ready completed");
        });
        function formatInShortForm(num) {
            if (num >= 10000000) {
                return (num / 10000000).toFixed(2).replace(/\.00$/, '') + " Cr";
            } else if (num >= 100000) {
                return (num / 100000).toFixed(2).replace(/\.00$/, '') + " L";
            } else if (num >= 1000) {
                return (num / 1000).toFixed(2).replace(/\.00$/, '') + " K";
            } else {
                return num;
            }
        }

        function paginationtext(currentPage, itemsPerPage, totalItems) {
            const $paginationtextcontainer = $('.paginationtext');
            $paginationtextcontainer.empty();

            // Handle case when there are no items
            if (totalItems === 0) {
                $paginationtextcontainer.append(
                    `<span class="paginationtext">No properties found for the selected criteria.</span>`
                );
                return;
            }

            const start = (currentPage - 1) * itemsPerPage + 1;
            const end = Math.min(currentPage * itemsPerPage, totalItems);

            $paginationtextcontainer.append(
                `<span class="paginationtext">Showing ${start} to ${end} of ${totalItems}</span>`
            );
        }

        function pagination(customItems = null) {
            const itemsPerPage = 12;
            const $allItems = $('.custom-property-card');
            const $items = customItems || $allItems.filter(':visible'); // default to visible items
            const totalItems = $items.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            let currentPage = 1;

            const $paginationContainer = $('.pagination');
            $paginationContainer.empty();

            if (totalPages <= 1) {
                $items.show(); // show all if only one page
                paginationtext(1, totalItems, totalItems);
                return;
            }

            function renderPage(page) {
                currentPage = page;

                // Update item visibility
                $allItems.hide(); // hide all first
                $items.slice((page - 1) * itemsPerPage, page * itemsPerPage).show();

                // Update pagination UI
                $('.pagination .page-link').removeClass('active');
                $(`.pagination .page-link[data-page="${page}"]`).addClass('active');

                // Update pagination text
                paginationtext(page, itemsPerPage, totalItems);
            }

            // Build pagination buttons
            $paginationContainer.append(
                `<li class="page-item"><a class="page-link" href="#" data-page="prev"><i class="fa-solid fa-angle-left"></i></a></li>`
            );

            for (let i = 1; i <= totalPages; i++) {
                $paginationContainer.append(
                    `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`
                );
            }

            $paginationContainer.append(
                `<li class="page-item"><a class="page-link" href="#" data-page="next"><i class="fa-solid fa-angle-right"></i></a></li>`
            );

            // Delegate click handler once
            $paginationContainer.off('click').on('click', '.page-link', function (e) {
                e.preventDefault();

                let targetPage = $(this).data('page');

                if (targetPage === 'prev') {
                    targetPage = Math.max(1, currentPage - 1);
                } else if (targetPage === 'next') {
                    targetPage = Math.min(totalPages, currentPage + 1);
                } else {
                    targetPage = Number(targetPage);
                }

                renderPage(targetPage);
            });

            // Initial render
            renderPage(currentPage);
        }

        $(document).ready(function () {
            paginationtext();
            pagination();
        });
    </script>
    <script>
       $(document).on('click', '.property-wishlist-btn', function () {
            const button = $(this);
            const propertyId = button.data('id');
            const isInWishlist = button.data('in-wishlist') == '1';

            const url = isInWishlist
                ? '/wishlist/remove/' + propertyId
                : '/wishlist/add/' + propertyId;

            $.ajax({
                url: url,
                method: 'GET',
                data: {
                    _token: $('meta[name="csrf-token"]').attr('content')
                },
                success: function (response) {
                    if (response.status === 'added') {
                        button.html('<i class="fas fa-heart text-red-500" style="color: red;"></i>');
                        button.data('in-wishlist', '1');
                    } else if (response.status === 'removed') {
                        button.html('<i class="far fa-heart"></i>');
                        button.data('in-wishlist', '0');
                    }
                }
            });
        });

        $(document).on('click', '.custom-property-card', function(e) {
            // Prevent navigation if clicking on a button or link inside the card
            if ($(e.target).closest('button, a').length === 0) {
                const url = $(this).data('url');
                if (url) {
                    window.location.href = url;
                }
            }
        });
        function header_title() {
            $('.our-Project-nav ul li a').removeClass('active-btn');
             $('.our-Project-nav ul li:first-child a').addClass('active-btn');
        }
    </script>
@endsection