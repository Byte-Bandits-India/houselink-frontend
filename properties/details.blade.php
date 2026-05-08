@extends('website.layouts.app')
@php use Illuminate\Support\Str; @endphp
@section('title', $property->seo_title)
@section('seo_desc', $property->seo_desc)

@section('headb')


    <!--<link rel="shortcut icon" type="image/x-icon"-->
    <!--      href="{{ $property->seo_img ? asset($property->seo_img) : asset('asset/site/images/favicon.png') }}">-->
     <link rel="shortcut icon" type="image/x-icon"
          href="{{ $property->seo_img ? asset($property->seo_img) : asset('asset/site/images/favicon.png') }}">
    
    @if($property->seo_img) 
        <!-- Open Graph Meta Tags -->
        <meta property="og:image" content="{{ asset($property->seo_img) }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="{{ $property->name }}">
        
        <!-- Twitter Card Meta Tags -->
        <meta name="twitter:image" content="{{ asset($property->seo_img) }}">
        <meta name="twitter:image:alt" content="{{ $property->name }}">
    @endif
    
    @if($property->seo_title)
        <!-- Open Graph Meta Tags -->
        <meta property="og:title" content="{{ $property->seo_title }}">
        <meta property="og:description" content="{{ $property->seo_desc ? $property->seo_desc : 'Explore ' . $property->name . ' property details, features, and amenities on Houselink360.' }}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        
        <!-- Twitter Card Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $property->seo_title }}">
        <meta name="twitter:description" content="{{ $property->seo_desc ? $property->seo_desc : 'Explore ' . $property->name . ' property details, features, and amenities on Houselink360.' }}">
    @endif
@endsection


@section('head')


    <style>
        /* Targets only direct li children of #menu */
        #menu > li > a.nav-link {
            color: #000 !important;  /* Change to black */
        }
         #menu > li > a.nav-link:hover {
            color: #153e75 !important;
        }

        .blur-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }

        .blur-overlay .btn-signup {
            z-index: 20;
        }

        .contact-form-container {
            position: relative;
        }

    </style>

    {{-- <div class="page-header parallaxie">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="page-header-box">
                        <h1 class="text-anime-style-2" data-cursor="-opaque">{{ $property->name }}</h1>
                        <nav class="wow fadeInUp">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="{{ route('index') }}">Home</a></li>
                                <li class="breadcrumb-item"><a href="{{ route('properties.all') }}">Properties</a></li>
                                <li class="breadcrumb-item active" aria-current="page">{{ $property->id }}</li>
                            </ol>
                        </nav>
                    </div>
                    </div>
            </div>
        </div>
    </div> --}}
@endsection
@section('styles')
    <style>
        .custom-slide {
            transition: all 0.4s ease;
            flex-shrink: 0;
        }
        .swiper-slide-prev {
            width: 20% !important;
            opacity: 1;
            margin-left: -1%;
        }
        .swiper-slide-next {
            width: 30% !important;
            opacity: 1;
            margin-right: -5%;
        }
        .swiper-slide-active {
            width: 60% !important;
            z-index: 2;
            opacity: 1;
            transform: scale(2.8);
        }
        .swiper-slide {
            transition: all 0.3s ease;
            transform: scale(0.8);
        }
        .custom-swiper-btn {
            background-color: white;
            border-radius: 10px;
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            top: 50%;
            transform: translateY(-50%);
            position: absolute;
            z-index: 10;
            cursor: pointer;
        }
        .custom-swiper-btn i {
            font-size: 18px;
            color: #111;
        }
        .swiper-container {
            width: 100%;
            /* padding: 20px 0; */
            position: relative;
        }
        @media (max-width: 768px) {
            .swiper-slide img {
                height: 300px !important;
                /* Adjust as needed for smaller screens */
            }
            .swiper_left {
                left: 10px !important;
                margin-left: 0 !important;
            }
            .swiper_right {
                right: 10px !important;
                margin-left: 0 !important;
            }
            .custom-swiper-btn {
                width: 40px !important;
                height: 40px !important;
            }
            .custom-swiper-btn i {
                font-size: 16px !important;
            }
            .right {
                margin-left: 90% !important;
            }
            .image {
                margin-left: 0;
            }
            .property-main-image {
                max-height: 350px;
            }
            .property-title {
                font-size: 1.8rem;
            }
            .heart {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-left: 0;
                margin-right: 0;
            }
            .wishlist-toggle {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                padding: 8px;
                border: none;
                background: none;
                font-size: 1.2rem;
            }
        }
        .page-header {
            background: url("{{ asset('assets/images/footer/front_image.png') }}");
            
        }
        .image {
            margin-left: 13%;
        }
        .content {
            margin-left: 6%;
        }
        /* Custom Styles */
        .property-detail-page {
            padding-bottom: 3rem;
        }
        .property-main-image {
            object-fit: cover;
            border-radius: 0.5rem;
            max-height: 500px;
        }
        .property-section {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .property-section:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
        }
        .property-title {
            color: #2c3e50;
            line-height: 1.2;
        }
        .price-section {
            transition: all 0.3s ease;
        }
        .price-section:hover {
            transform: scale(1.02);
        }
        .action-btn {
            transition: all 0.3s ease;
            padding: 0.75rem;
            border-radius: 0.5rem;
            font-weight: 500;
        }
        .action-btn:hover {
            transform: translateY(-2px);
        }
        .save-property.saved {
            color: #dc3545;
            border-color: #dc3545;
        }
        .save-property.saved i {
            font-weight: 900;
        }
        .custom-sticky-follow {
            position: sticky;
            top: 20px;
            max-height: calc(100vh - 40px);
            /* Prevent overflow */
            overflow-y: auto;
        }
        #toast-message {
            transition: opacity 0.3s ease-in-out;
            pointer-events: none;
        }
        #toast-message.show {
            opacity: 1;
            pointer-events: auto;
        }
        .heart {
            margin-left: 40%;
        }
        
        /* Overview Section Mobile Responsive Styles */
        .overview-item {
            padding: 12px;
            border-radius: 8px;
            background-color: #f8f9fa;
            transition: all 0.3s ease;
            min-height: 80px;
            width: 100%;
        }
        
        .overview-item:hover {
            background-color: #e9ecef;
            transform: translateY(-2px);
        }
        
        .overview-icon {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .overview-content {
            flex: 1;
            min-width: 0;
        }
        
        .overview-content .h6 {
            font-size: 0.875rem;
            color: #6c757d;
            margin-bottom: 4px;
        }
        
        .overview-content .h5 {
            font-size: 1.25rem;
            color: #2c3e50;
            line-height: 1.2;
        }
        
        /* Mobile Responsive Adjustments */
        @media (max-width: 768px) {
            .overview-item {
                padding: 12px;
                min-height: 70px;
                margin-bottom: 8px;
            }
            
            .overview-icon {
                margin-right: 15px !important;
            }
            
            .overview-icon img {
                width: 30px !important;
                height: 30px !important;
            }
            
            .overview-content .h6 {
                font-size: 0.9rem;
                margin-bottom: 3px;
            }
            
            .overview-content .h5 {
                font-size: 1.2rem;
            }
        }
        
        @media (max-width: 576px) {
            .overview-item {
                padding: 15px;
                min-height: 65px;
                margin-bottom: 10px;
            }
            
            .overview-icon {
                margin-right: 12px !important;
            }
            
            .overview-icon img {
                width: 28px !important;
                height: 28px !important;
            }
            
            .overview-content .h6 {
                font-size: 0.85rem;
                margin-bottom: 2px;
            }
            
            .overview-content .h5 {
                font-size: 1.1rem;
            }
        }
        
        /* Square Details Mobile Responsive Styles */
        .square-detail-item {
            padding: 12px;
            border-radius: 8px;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            margin-bottom: 8px;
        }
        
        .square-detail-item:hover {
            transform: translateY(-1px);
        }
        
        .square-detail-label {
            flex-shrink: 0;
        }
        
        .square-detail-value {
          
            font-weight: 500;
          
        }
        
        /* Mobile Responsive Adjustments for Square Details */
        @media (max-width: 768px) {
            .square-detail-item {
                padding: 15px;
                margin-bottom: 10px;
            }
            
            .square-detail-label {
                font-size: 0.9rem;
            }
            
            .square-detail-value {
                font-size: 0.9rem;
            }
        }
        
        @media (max-width: 576px) {
            .square-detail-item {
                padding: 12px;
                margin-bottom: 8px;
            }
            
            .square-detail-label {
                font-size: 0.9rem;
            }
            
            .square-detail-value {
                font-size: 0.9rem;
            }
        }
        
        /* Enhanced styling for better visual hierarchy */
        .property-actions {
            margin-top: 2rem;
        }
        .action-btn {
            padding: 0.75rem 1.25rem;
            transition: all 0.3s ease;
            border-radius: 8px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .action-btn:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
        }
        .action-btn .action-label {
            white-space: nowrap;
        }
        .btn-primary {
            background: linear-gradient(135deg, #163d75, #4f88cc);
            border: none;
            border: none;
        }
        .save-property.saved i {
            color: #dc3545;
            font-weight: 900;
        }
        .property_cont {
            margin-top: -7%;
            z-index: 1;
        }
        .text-primary {
            --bs-text-opacity: 1;
            color: rgb(22 61 117) !important;
        }
        .form-control {
            display: block;
            width: 100%;
            width: 100%;
            height: 48px;
            padding: 0 10px;
            border-radius: 5px;
            border: 1px solid var(--border-color);
            background-color: transparent;
            color: var(--text-color);
            padding: .375rem .75rem;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: var(--bs-body-color);
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-color: var(--bs-body-bg);
            background-clip: padding-box;
            border: var(--bs-border-width) solid var(--bs-border-color);
            border-radius: var(--bs-border-radius);
            transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        }
        .card-header {
            background-color: rgb(33 37 41 / 0%);
        }

        .lightbox .lb-prev, .lightbox .lb-next {
    color: black;
    font-size: 24px;
}

/* Position the close button at top right */
.lightbox .lb-close {
    position: absolute !important;
    top: 0px !important;
    right: 20px !important;
    bottom: auto !important;
    left: auto !important;
    z-index: 9999 !important;
}

/* Ensure all lightbox images have the same size when opened */
.lightbox .lb-image {
    object-fit: contain;
    width: 80vw !important;
    height: 70vh !important;
    max-width: 1200px !important;
    max-height: 800px !important;
}

/* Mobile responsive for lightbox images */
@media (max-width: 768px) {
    .lightbox .lb-image {
        width: 90vw !important;
        height: 60vh !important;
        max-width: 400px !important;
        max-height: 300px !important;
        object-fit: contain !important;
    }
    
    .lightbox .lb-outerContainer {
        width: 90vw !important;
        height: 60vh !important;
        max-width: 400px !important;
        max-height: 300px !important;
    }
    
    .lightbox .lb-dataContainer {
        width: 90vw !important;
        max-width: 400px !important;
    }
    
    .lightbox .lb-close {
        top: -30px !important;
        right: 5px !important;
        font-size: 24px !important;
        color: white !important;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.8) !important;
    }
}

.gallery-img {
    width: 100% !important;
    height: 400px !important;
    object-fit: cover;
}

/* Hide Lightbox2 caption at the bottom */
         .lb-caption {
             display: none !important;
         }
         
                   /* Property Video Section Styles - Theme Based */
          .intro-video-box {
              position: relative;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease;
          }
          
          .intro-video-box:hover {
              transform: translateY(-5px);
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }
          
          .intro-video-image {
              position: relative;
              overflow: hidden;
          }
          
          .intro-video-image img {
              transition: transform 0.5s ease;
          }
          
          .intro-video-box:hover .intro-video-image img {
              transform: scale(1.05);
          }
          
          .video-play-button {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 2;
          }
          
          .video-play-button a {
              display: inline-block;
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #163d75, #4f88cc);
              border-radius: 50%;
              text-align: center;
              line-height: 80px;
              color: white;
              text-decoration: none;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 14px;
              letter-spacing: 1px;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          }
          
          .video-play-button a:hover {
              background: linear-gradient(135deg, #0f2a4f, #3a6ba8);
              transform: scale(1.1);
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
              color: white;
          }
          
          .image-anime {
              margin: 0;
              position: relative;
          }
          
          .image-intro {
              position: relative;
              overflow: hidden;
          }

           #email-login,
#name-login {
    cursor: not-allowed;
    background-color: rgba(209, 209, 209, 0.669);
    border: 1px solid #ced4da; 
    box-shadow: none !important; 
}

#email-login:focus,
#name-login:focus,
#property_name-login:focus, {
    box-shadow: none !important;
}

            #property_name-login,#property_name-signup{
                background-color: rgba(209, 209, 209, 0.669);
            }
            #phone-login:focus,#property_name-login:focus,
            #message-login:focus{
             box-shadow: none !important; 

            }
            #message-signup,#property_name-signup,
            #email-signup,#phone-signup,#name-signup,#state,#city{
                box-shadow: none !important;
            }


    </style>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightbox2@2.11.4/dist/css/lightbox.min.css">
@endsection
@section('content')
    <div class="property-detail-page container-fluid px-0">
        <div class="row gx-0 gx-lg-4">
            <div class="swiper-container mySwiper rounded-3 overflow-hidden shadow-sm">
                <div class="swiper-wrapper">
                    @php
                        // Category default images mapping
                        $categoryDefaultImages = [
                            1  => 'assets/default_images/apartmentAvatar.jpg',
                            2  => 'assets/default_images/villaAvatar.jpg',
                            3  => 'assets/default_images/plotsAvatar.jpg',
                            4  => 'assets/default_images/houseAvatar.jpg',
                            5  => 'assets/default_images/commercialAvatar.jpg', // Land
                            6  => 'assets/default_images/commercialAvatar.jpg', // Commercial Property
                            7  => 'assets/default_images/commercialAvatar.jpg', // Shop
                            8  => 'assets/default_images/commercialAvatar.jpg', // Building
                            9  => 'assets/default_images/commercialAvatar.jpg', // Godown
                            10 => 'assets/default_images/commercialAvatar.jpg', // Warehouse
                            11 => 'assets/default_images/commercialAvatar.jpg', // Office Space
                        ];
                        
                        // Get default image based on property category, fallback to generic default
                        $defaultImage = $categoryDefaultImages[$property->category_id] ?? 'assets/default_images/default.jpg';
                        
                        $images = $property && $property->images->isNotEmpty() ? $property->images : collect([(object)['image_url' => $defaultImage]]);
                        $imageCount = $images->count();
                        $repeatCount = $imageCount < 6 ? ceil(6 / $imageCount) : 1;
                    @endphp

                    @for ($i = 0; $i < $repeatCount; $i++)
                        @foreach ($images as $image)
                            <div class="swiper-slide">
                                    <a href="{{ asset($image->image_url) }}" data-lightbox="property-gallery">
                                        <img src="{{ asset($image->image_url) }}" alt="Property image" class="img-fluid"
                                            style="width: 100%; height: 400px; object-fit: cover; cursor: zoom-in;">
                                    </a>

                            </div>
                        @endforeach
                    @endfor
                    {{-- @foreach ($images as $image)
                        <div class="swiper-slide">
                            <a href="{{ asset($image->image_url) }}" data-lightbox="property-gallery" data-title="{{ $property->name }}">
                                <img src="{{ asset($image->image_url) }}" alt="Property image" class="img-fluid gallery-img"
                                    style="width: 100%; height: 400px; object-fit: cover; cursor: zoom-in;">
                            </a>
                        </div>
                    @endforeach --}}

                </div>

                <div class="custom-swiper-btn swiper_left" style="margin-left: 1%;">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <div class="custom-swiper-btn swiper_right" style="margin-left: 95%;">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>

          

            <div class="col-lg-11 mx-auto property_cont">
                <div class="property-header card mt-4 border-0 shadow-sm"
                    style="    box-shadow: rgb(38 57 77 / 27%) 0px 20px 30px -10px !important;">
                    <div class="card-body p-4">
                        @if ($property)
                            <div class="d-flex flex-column flex-md-row justify-content-between align-items-start">
                                <div class="mb-3 mb-md-0">
                                    <h4 class="property-title display-5 fw-bold mb-2 text-primary">{{ $property->name }}
                                    </h4>
                                </div>
                                {{-- <div class="price-section bg-opacity-10 p-3 rounded-3">
                                    <div class="price-tag display-6 fw-bold ">₹{{ number_format($property->price) }}</div>
                                </div> --}}
                                <div class="price-section bg-opacity-10 p-3 rounded-3">
                                    <div class="price-tag display-6 fw-bold priceTag" data-price="{{ $property->price }}">
                                        @php
                                            $price = $property->price;
                                            $priceStr = (string)floor($price);
                                            $lastThree = substr($priceStr, -3);
                                            $restUnits = substr($priceStr, 0, -3);
                                            $formattedPrice = $restUnits != '' ? preg_replace('/\B(?=(\d{2})+(?!\d))/', ',', $restUnits) . ',' . $lastThree : $lastThree;
                                        @endphp
                                        ₹{{ $formattedPrice }}
                                    </div>
                                </div>

                            </div>
                            <div class="quick-facts mt-4 pt-3 border-top">
                                <div class="row g-3">
                                    <div class="col-md-2">
                                        <div class="d-flex align-items-center">
                                            <i class="fa-solid fa-calendar text-primary me-2"></i>
                                            <span>Listed:
                                                {{ \Carbon\Carbon::parse($property->created_at)->format('M d, Y') }}</span>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-tag text-primary me-2"></i>
                                            <span>{{ $property->category_name }}</span>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-eye text-primary me-2"></i>
                                            <span><?php echo number_format($property->views,0) ?> Views</span>
                                        </div>
                                    </div>
                                    <div class="col-md-1 heart">
                                        <button  class="wishlist-toggle" data-id="{{ $property->id }}"
                                            data-in-wishlist="{{ in_array($property->id, $wishlistIds) ? '1' : '0' }}">
                                            @if(in_array($property->id, $wishlistIds))
                                                <i class="fas fa-heart text-red-500" style="color: red;"></i> {{-- Filled heart --}}
                                            @else
                                                <i class="far fa-heart"></i> {{-- Empty heart --}}
                                            @endif
                                        </button>
                                    </div>
                                </div>
                            </div>
                        @else
                            <div class="alert alert-danger">Property not found.</div>
                        @endif
                        <div class="row mt-4">
                            <div class="col-lg-7 pe-lg-4">
                                <div class="property-section card mb-4 border-0 shadow-sm">
                                    <div class="card-header bg-white border-0 py-3">
                                        <h2 class="h4 mb-0 fw-bold"> Description</h2>
                                    </div>
                                    <div class="card-body px-4 py-3">
                                        <div class="property-description">
                                            {!! $property->description ?? '<p class="text-muted">No description provided</p>' !!}
                                        </div>
                                    </div>
                                </div>
                             
                                <div class="property-section card mb-4 border-0 shadow-sm">
                                    <div class="card-header bg-white border-0 py-3">
                                        <h2 class="h4 mb-0 fw-bold">Overview</h2>
                                    </div>
                                    <div class="card-body px-4 py-3">
                                        <div class="property-overview">
                                                 <div class="row g-3">
                                                 {{-- Bedrooms: Show for Apartment, Villa, House (always), Hide for Commercial --}}
                                                 @if(in_array($property->category_id, [1, 2, 4]))
                                                     <div class="col-12 col-md-6">
                                                         <div class="d-flex align-items-center overview-item">
                                                             <div class="overview-icon me-3">
                                                                 <img src="{{ asset('assets/facility/bedrooms.png') }}"
                                                                     alt="Bedrooms" class="img-fluid"
                                                                     style="width: 32px; height: 32px;">
                                                             </div>
                                                             <div class="overview-content">
                                                                 <div class="h6 mb-1">Bedrooms</div>
                                                                 <div class="h5 fw-bold mb-0">{{ $totalBedrooms ?? '0' }}</div>
                                                             </div>
                                                         </div>
                                                     </div>
                                                 @endif
                                                 
                                                 {{-- Bathrooms: Show for all categories when > 0, or always for residential --}}
                                                 @if($totalBathrooms > 0 || in_array($property->category_id, [1, 2, 4]))
                                                     <div class="col-12 col-md-6">
                                                         <div class="d-flex align-items-center overview-item">
                                                             <div class="overview-icon me-3">
                                                                 <img src="{{ asset('assets/facility/bathrooms.png') }}"
                                                                     alt="Bathrooms" class="img-fluid"
                                                                     style="width: 32px; height: 32px;">
                                                             </div>
                                                             <div class="overview-content">
                                                                 <div class="h6 mb-1">Bathrooms</div>
                                                                 <div class="h5 fw-bold mb-0">{{ $totalBathrooms ?? '0' }}</div>
                                                             </div>
                                                         </div>
                                                     </div>
                                                 @endif
                                                
                                                <div class="col-12 col-md-6">
                                                    <div class="d-flex align-items-center overview-item">
                                                        <div class="overview-icon me-3">
                                                            <img src="{{ asset('assets/facility/price.png') }}"
                                                                alt="Price" class="img-fluid"
                                                                style="width: 32px; height: 32px;">
                                                        </div>
                                                        <div class="overview-content">
                                                            <div class="h6 mb-1">Price</div>
                                                            <div class="h5 fw-bold mb-0 priceTag" data-price="{{ $property->price }}">
                                                                @php
                                                                    $priceStr2 = (string)floor($property->price);
                                                                    $lastThree2 = substr($priceStr2, -3);
                                                                    $restUnits2 = substr($priceStr2, 0, -3);
                                                                    $formattedPrice2 = $restUnits2 != '' ? preg_replace('/\B(?=(\d{2})+(?!\d))/', ',', $restUnits2) . ',' . $lastThree2 : $lastThree2;
                                                                @endphp
                                                                ₹{{ $formattedPrice2 }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 col-md-6">
                                                    <div class="d-flex align-items-center overview-item">
                                                        <div class="overview-icon me-3">
                                                            <img src="{{ asset('assets/facility/tag.png') }}"
                                                                alt="Property Type" class="img-fluid"
                                                                style="width: 32px; height: 32px;">
                                                        </div>
                                                        <div class="overview-content">
                                                            <div class="h6 mb-1">Property Type</div>
                                                            <h5 class="h5 fw-bold mb-0" style="font-size: 19px;">
                                                                @if($property->category_name == 'Commercial property' && isset($property->custom_fields))
                                                                    @php
                                                                        $buildingType = collect($property->custom_fields)->firstWhere('field_name', 'Select');
                                                                    @endphp
                                                                    @if($buildingType && $buildingType['field_value'])
                                                                        {{ $property->category_name }} ({{ $buildingType['field_value'] }})
                                                                    @else
                                                                        {{ $property->category_name }}
                                                                    @endif
                                                                @else
                                                                    {{ $property->category_name }}
                                                                @endif
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                                                 </div>
                                 
                                                                   {{-- Property Video Section --}}
                                    @if($videoLink && $videoLink->video_url)
                                      <div class="property-section card mb-4 border-0 shadow-sm">
                                          <div class="card-header bg-white border-0 py-3">
                                              <h2 class="h4 mb-0 fw-bold">Property Video</h2>
                                          </div>
                                          <div class="card-body px-4 py-3">
                                              @php
                                                  $ytEmbedId = null;
                                                  if (preg_match('/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/', $videoLink->video_url, $m)) {
                                                      $ytEmbedId = $m[1];
                                                  }
                                              @endphp
                                              @if($ytEmbedId)
                                                  <div class="ratio ratio-16x9">
                                                      <iframe src="https://www.youtube.com/embed/{{ $ytEmbedId }}?autoplay=1&mute=1&loop=1&playlist={{ $ytEmbedId }}"
                                                              title="Property Video"
                                                              allowfullscreen
                                                              class="rounded shadow-sm">
                                                      </iframe>
                                                  </div>
                                              @else
                                                  <video controls class="w-100 rounded shadow-sm" style="max-height:400px;">
                                                      <source src="{{ $videoLink->video_url }}">
                                                  </video>
                                              @endif
                                          </div>
                                      </div>
                                  @endif
                                
                                 @if ($property && $property->keyFeatures->isNotEmpty())
                                    <div class="property-section card mb-4 border-0 shadow-sm">
                                        <div class="card-header bg-white border-0 py-3">
                                            <h2 class="h4 mb-0 fw-bold">Amenities & Features</h2>
                                        </div>
                                        <div class="card-body px-4 py-3">
                                            <div class="row g-3">
                                                @foreach ($property->keyFeatures as $feature)
                                                    <div class="col-6 col-md-4">
                                                        <div class="d-flex align-items-center p-2 rounded">
                                                            <img src="{{ $feature->icon }}"
                                                                alt="{{ $feature->keyfeatures_name }}"
                                                                style="width: 25px; height: 25px; margin-right: 4px;" />
                                                            <span class="small">{{ $feature->keyfeatures_name }}</span>
                                                        </div>
                                                    </div>
                                                @endforeach
                                            </div>
                                        </div>
                                    </div>
                                @endif
                                <div class="property-section card mb-4 border-0 shadow-sm">
                                    <div class="card-header bg-white border-0 py-3">
                                        <h2 class="h4 mb-0 fw-bold">Location</h2>
                                    </div>
                                    <div class="card-body px-4 py-3">
                                        {{-- <h4 class="h5 mb-3">Address</h4> --}}
                                        <p class="mb-4">{{ ucfirst($property->location ?? 'Location not specified') }}, {{$property->city->name}}, {{$property->state->name}}.</p>
                                    </div>
                                </div>
                                @if ($property && isset($features) && $features->isNotEmpty())
                                <div class="property-section card mb-4 border-0 shadow-sm">
                                    <div class="card-header bg-white border-0 py-3">
                                        <h2 class="h4 mb-0 fw-bold">Nearby Amenities</h2>
                                    </div>
                                    <div class="card-body px-4 py-3">
                                        <div class="row g-3">
                                            @foreach ($features as $feature)
                                                <div class="col-12 col-md-4">
                                                    <div class="d-flex align-items-center rounded">
                                                        <img src="{{ asset('storage/'. $feature->facility->image) }}"
                                                            alt="{{ $feature->facility->name ?? 'Facility' }}"
                                                            class="img-fluid me-2"
                                                            style="width: 30px; height: 30px; object-fit: cover;">
                                                        <div>
                                                            <div class="small fw-bold">
                                                                {{ $feature->facility->name ?? 'Unknown' }}</div>
                                                            <div class="text-muted xsmall">{{ $feature->facility_value }}
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            @endforeach
                                        </div>
                                    </div>
                                </div>
                                @endif

                                {{-- @if ($property->custom_fields && is_array($property->custom_fields))
        <div class="property-section card mb-4 border-0 shadow-sm">
            <div class="card-header bg-white border-0 py-3">
                <h2 class="h4 mb-0 fw-bold">Square Details</h2>
            </div>
            <div class="card-body px-4 py-3">
                <div class="row g-3">
                    @foreach ($property->custom_fields as $field)
                        @if (
                            Str::contains(strtolower($field['field_name']), 'area') ||
                            Str::contains(strtolower($field['field_name']), 'length') ||
                            Str::contains(strtolower($field['field_name']), 'breadth') ||
                            Str::contains(strtolower($field['field_name']), 'carpet')
                        )
                            <div class="col-6 col-md-4">
                                <div class="d-flex align-items-center p-2 rounded">
                                    <span class="fw-bold">{{ $field['field_name'] }}:</span>
                                    <span class="ms-2">{{ $field['field_value'] }}</span>
                                </div>
                            </div>
                        @endif
                    @endforeach
                   
                </div>
            </div>
        </div>
    @endif --}}
@php
    $unitLabels = [
        '1' => 'Sq. Ft',
        '2' => 'Square Inches',
        '3' => 'Acres',
        '4' => 'Cents',
        '5' => 'Square Meters',
        '6' => 'Square Yards',
        '7' => 'Hectares',
    ];

    // Extract unit from any of the square-related fields
    $defaultUnitCode = collect($property->custom_fields)->first(function ($field) {
        $fieldName = strtolower($field['field_name']);
        return (
            !empty($field['unit']) &&
            (
                str_contains($fieldName, 'area') ||
                str_contains($fieldName, 'uds') ||
                str_contains($fieldName, 'length') ||
                str_contains($fieldName, 'breadth') ||
                str_contains($fieldName, 'carpet') ||
                str_contains($fieldName, 'floor') 
            )
        );
    })['unit'] ?? null;

    $defaultUnitLabel = $defaultUnitCode && isset($unitLabels[$defaultUnitCode]) ? $unitLabels[$defaultUnitCode] : null;
@endphp

@if ($property->custom_fields && is_array($property->custom_fields))
    <div class="property-section card mb-4 border-0 shadow-sm">
        <div class="card-header bg-white border-0 py-3">
            <h2 class="h4 mb-0 fw-bold">Additional Information</h2>
        </div>
        <div class="card-body px-4 py-3">
            <div class="row g-3">
                {{-- Floor Details for Apartments --}}
                @if($property->category_name == 'Apartments')
                    @php
                        $floorField = collect($property->custom_fields)->firstWhere('field_name', 'Property on Floor');
                        $totalFloorField = collect($property->custom_fields)->firstWhere('field_name', 'Total Floors');
                    @endphp
                    
                    
                    @if($totalFloorField && $totalFloorField['field_value'])
                        <div class="col-12 col-md-6">
                            <div class="d-flex align-items-center square-detail-item">
                                <span class="fw-bold square-detail-label">Total Floors:</span>
                                <span class="ms-2 square-detail-value">{{ $totalFloorField['field_value'] }}</span>
                            </div>
                        </div>
                    @endif

                    @if($floorField && $floorField['field_value'])
                    <div class="col-12 col-md-6">
                        <div class="d-flex align-items-center square-detail-item">
                            <span class="fw-bold square-detail-label">Property on Floor:</span>
                            <span class="ms-2 square-detail-value">{{ $floorField['field_value'] }}</span>
                        </div>
                    </div>
                    @endif
                @endif
                
                @php $shownAreaFields = []; @endphp
                @foreach ($property->custom_fields as $field)
                    @php
                        $fieldName = strtolower($field['field_name']);
                        $fieldValue = $field['field_value'] ?? null;
                    @endphp

                    @if (
                        ($fieldValue !== null && $fieldValue !== '') &&
                        !in_array($fieldName, $shownAreaFields) &&
                        (
                            str_contains($fieldName, 'area') ||
                            str_contains($fieldName, 'length') ||
                            str_contains($fieldName, 'breadth') ||
                            str_contains($fieldName, 'carpet')  ||
                            str_contains($fieldName, 'uds')
                        )
                    )
                        @php $shownAreaFields[] = $fieldName; @endphp
                        <div class="col-12 col-md-6">
                            <div class="d-flex align-items-center square-detail-item">
                                <span class="fw-bold square-detail-label">{{ $field['field_name'] }}:</span>
                                <span class="ms-2 square-detail-value">
                                    {{ $fieldValue }}
                                    @if ($defaultUnitLabel)
                                        {{ $defaultUnitLabel }}
                                    @endif
                                </span>
                            </div>
                        </div>
                    @endif
                @endforeach
            </div>
        </div>
    </div>
@endif

{{-- Property Details Section --}}
@php
    $hasPropDetails =
        (!empty($property->house_type) && in_array($property->category_id, [1, 2, 4])) ||
        !empty($property->tenant_preference) ||
        !empty($property->construction_age) ||
        !empty($property->ownership_type) ||
        !empty($property->furnishing_type) ||
        !empty($property->water_supply) ||
        !empty($property->food_preference) ||
        !empty($property->pet_policy) ||
        !empty($property->balcony) ||
        !empty($property->garden) ||
        !empty($property->swimming_pool) ||
        !empty($property->corner_property) ||
        !empty($property->compound_wall) ||
        !empty($property->property_suitable_for) ||
        !empty($property->utility_area) ||
        !empty($property->loading_unloading_facility) ||
        !empty($property->pantry_area) ||
        !empty($property->key_specifications) ||
        !empty($property->parking_availability) ||
        !empty($property->parking_type) ||
        !empty($property->parking_slots_count);
@endphp
@if($hasPropDetails)
<div class="property-section card mb-4 border-0 shadow-sm">
    <div class="card-header bg-white border-0 py-3">
        <h2 class="h4 mb-0 fw-bold">Property Details</h2>
    </div>
    <div class="card-body px-4 py-3">
        <div class="row g-3">
            @if(!empty($property->house_type) && in_array($property->category_id, [1, 2, 4]))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">House Type:</span>
                    <span class="ms-2 square-detail-value">{{ $property->house_type }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->construction_age))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Construction Age:</span>
                    <span class="ms-2 square-detail-value">{{ $property->construction_age }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->ownership_type))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Ownership:</span>
                    <span class="ms-2 square-detail-value">{{ ucwords(str_replace('_', ' ', $property->ownership_type)) }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->furnishing_type))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Furnishing:</span>
                    <span class="ms-2 square-detail-value">{{ $property->furnishing_type }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->water_supply))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Water Supply:</span>
                    <span class="ms-2 square-detail-value">{{ $property->water_supply }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->food_preference))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Food Preference:</span>
                    <span class="ms-2 square-detail-value">{{ $property->food_preference }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->pet_policy))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Pet Policy:</span>
                    <span class="ms-2 square-detail-value">{{ $property->pet_policy }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->balcony))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Balcony:</span>
                    <span class="ms-2 square-detail-value">{{ $property->balcony }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->garden))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Garden:</span>
                    <span class="ms-2 square-detail-value">{{ $property->garden }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->swimming_pool))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Swimming Pool:</span>
                    <span class="ms-2 square-detail-value">{{ $property->swimming_pool }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->corner_property))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Corner Property:</span>
                    <span class="ms-2 square-detail-value">{{ $property->corner_property }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->compound_wall))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Compound Wall:</span>
                    <span class="ms-2 square-detail-value">{{ $property->compound_wall }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->property_suitable_for))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Suitable For:</span>
                    <span class="ms-2 square-detail-value">{{ $property->property_suitable_for }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->utility_area))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Utility Area:</span>
                    <span class="ms-2 square-detail-value">{{ $property->utility_area }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->loading_unloading_facility))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Loading / Unloading:</span>
                    <span class="ms-2 square-detail-value">{{ $property->loading_unloading_facility }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->pantry_area))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Pantry Area:</span>
                    <span class="ms-2 square-detail-value">{{ $property->pantry_area }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->key_specifications))
            <div class="col-12">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Key Specifications:</span>
                    <span class="ms-2 square-detail-value">
                        @php
                            $specs = is_array($property->key_specifications)
                                ? $property->key_specifications
                                : json_decode($property->key_specifications, true) ?? [$property->key_specifications];
                        @endphp
                        {{ implode(', ', array_filter($specs)) }}
                    </span>
                </div>
            </div>
            @endif

            {{-- Parking --}}
            @if(!empty($property->parking_availability))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Parking:</span>
                    <span class="ms-2 square-detail-value">
                        {{ $property->parking_availability }}
                        @if($property->parking_availability === 'Yes' && !empty($property->parking_type))
                            @php
                                $pTypes = is_array($property->parking_type)
                                    ? $property->parking_type
                                    : json_decode($property->parking_type, true) ?? [$property->parking_type];
                            @endphp
                            ({{ implode(', ', $pTypes) }})
                        @endif
                        @if(!empty($property->parking_slots_count))
                            — {{ $property->parking_slots_count }} slot(s)
                        @endif
                    </span>
                </div>
            </div>
            @endif

            @if(!empty($property->tenant_preference))
            <div class="col-12">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Tenant Preference:</span>
                    <span class="ms-2 square-detail-value">
                        @php
                            if (is_array($property->tenant_preference)) {
                                $tenants = $property->tenant_preference;
                            } else {
                                $tenants = json_decode($property->tenant_preference, true);
                                if (!is_array($tenants)) {
                                    $tenants = array_map('trim', explode(',', $property->tenant_preference));
                                }
                            }
                            echo implode(', ', array_map('trim', $tenants));
                        @endphp
                    </span>
                </div>
            </div>
            @endif
        </div>
    </div>
</div>
@endif

{{-- Rent/Lease Financial Details Section --}}
@if(in_array(strtolower($property->property_for ?? ''), ['rent', 'lease']))
@php
    $hasFinancialDetails =
        !empty($property->security_deposit) ||
        !empty($property->security_deposit_type) ||
        !empty($property->maintenance_charge_status) ||
        !empty($property->lease_duration) ||
        !empty($property->maintenance_responsibility) ||
        !empty($property->notice_period) ||
        !empty($property->availability_status) ||
        !empty($property->availability_date);
@endphp
@if($hasFinancialDetails)
<div class="property-section card mb-4 border-0 shadow-sm">
    <div class="card-header bg-white border-0 py-3">
        <h2 class="h4 mb-0 fw-bold">Rental / Lease Details</h2>
    </div>
    <div class="card-body px-4 py-3">
        <div class="row g-3">
            @if(!empty($property->security_deposit))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Security Deposit:</span>
                    <span class="ms-2 square-detail-value">
                        ₹{{ number_format($property->security_deposit) }}
                        @if(!empty($property->security_deposit_type))
                            ({{ $property->security_deposit_type }})
                        @endif
                    </span>
                </div>
            </div>
            @endif

            @if(!empty($property->maintenance_charge_status))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Maintenance Charge:</span>
                    <span class="ms-2 square-detail-value">
                        @if($property->maintenance_charge_status === 'Yes' && !empty($property->maintenance_charge_amount))
                            ₹{{ number_format($property->maintenance_charge_amount) }}
                        @else
                            {{ $property->maintenance_charge_status }}
                        @endif
                    </span>
                </div>
            </div>
            @endif

            @if(!empty($property->lease_duration))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Lease Duration:</span>
                    <span class="ms-2 square-detail-value">{{ $property->lease_duration }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->maintenance_responsibility))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Maintenance By:</span>
                    <span class="ms-2 square-detail-value">{{ $property->maintenance_responsibility }}</span>
                </div>
            </div>
            @endif

            @if(!empty($property->notice_period))
            <div class="col-12 col-md-6">
                <div class="d-flex align-items-center square-detail-item">
                    <span class="fw-bold square-detail-label">Notice Period:</span>
                    <span class="ms-2 square-detail-value">{{ $property->notice_period }}</span>
                </div>
            </div>
            @endif

        </div>
    </div>
</div>
@endif
@endif

{{-- Brokerage Information Section --}}
@if($property->brokerage_type)
    <div class="property-section card mb-4 border-0 shadow-sm">
        <div class="card-header bg-white border-0 py-3">
            <h2 class="h4 mb-0 fw-bold">Brokerage Type</h2>
        </div>
        <div class="card-body px-4 py-3">
            <div class="row g-3">
                <div class="col-12">
                    <div class="d-flex align-items-center square-detail-item">
                        
                        <span class="ms-2 square-detail-value">
                            @if($property->brokerage_type == 'no_brokerage')
                                No Brokerage
                            @elseif($property->brokerage_type == 'fixed')
                                Fixed Amount: ₹{{ number_format($property->brokerage_fee) }}
                            @elseif($property->brokerage_type == 'percentage')
                                Percentage: {{ (int)$property->brokerage_fee }}%
                            @else
                                {{ ucfirst(str_replace('_', ' ', $property->brokerage_type)) }}: {{ $property->brokerage_fee }}
                            @endif
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endif

 {{-- <div class="property-section card mb-4 border-0 shadow-sm">
    <div class="card-header bg-white border-0 py-3">
        <h2 class="h4 mb-0 fw-bold">Direction Facing</h2>
    </div>
    <div class="card-body px-4 py-3">
        <p class="mb-4"> {{ $property->direction_facing }} </p>
    </div>
</div> --}}

<div class="row">
    {{-- Possession Status --}}
    @if (!empty( $videoLink->possession_status))
        <div class="col-md-6">
            <div class="property-section card mb-4 border-0 shadow-sm h-100">
                <div class="card-header bg-white border-0 py-3">
                    <h2 class="h5 mb-0 fw-bold">Possession Status</h2>
                </div>
                <div class="card-body px-4 py-3">
                    <p class="mb-0">{{ $videoLink->possession_status }}
                        @if($videoLink->possession_status === 'Available From' && !empty($property->availability_date))
                            — {{ \Carbon\Carbon::parse($property->availability_date)->format('d M Y') }}
                        @endif
                    </p>
                </div>
            </div>
        </div>
    @endif

    {{-- Direction Facing --}}
    @if (!empty($property->direction_facing))
        <div class="col-md-6">
            <div class="property-section card mb-4 border-0 shadow-sm h-100">
                <div class="card-header bg-white border-0 py-3">
                    <h2 class="h5 mb-0 fw-bold">Direction Facing</h2>
                </div>
                <div class="card-body px-4 py-3">
                    <p class="mb-0">{{ $property->direction_facing }}</p>
                </div>
            </div>
        </div>
    @endif
</div>



                                {{-- <div class="container my-4">
                                    <div class="accordion" id="accordionExample">
                                        <div class="card-header bg-white border-0 py-3">
                                            <h2 class="h4 mb-0 fw-bold">Floor plans</h2>
                                        </div>
                                        @foreach ($facilities as $index => $item)
                                            <div class="accordion-item">
                                                <h2 class="accordion-header" id="heading{{ $index }}">
                                                    <button
                                                        class="accordion-button p-3 {{ $index !== 0 ? 'collapsed' : '' }}"
                                                        type="button" data-bs-toggle="collapse"
                                                        data-bs-target="#collapse{{ $index }}"
                                                        aria-expanded="{{ $index === 0 ? 'true' : 'false' }}"
                                                        aria-controls="collapse{{ $index }}"
                                                        style="padding: 0; background: none; border: none;">
                                                        <div class="container-fluid">
                                                            <div class="row w-100 m-0">
                                                                <div class="col-md-6" style="margin-left: -30px;">
                                                                    <p class="m-0"><b>{{ $item->name }}</b></p>
                                                                </div>
                                                                <div class="col-md-3" style="margin-left: 30px;">
                                                                    <p class="m-0">
                                                                        <img src="{{ asset('assets/facility/bathrooms.png') }}"
                                                                            alt="Bathroom" class="img-fluid"
                                                                            style="width: 20px; height: 20px;">
                                                                        {{ $item->bathrooms }} bathrooms
                                                                    </p>
                                                                </div>
                                                                <div class="col-md-3">
                                                                    <p class="m-0">
                                                                        <img src="{{ asset('assets/facility/bedrooms.png') }}"
                                                                            alt="Bedroom" class="img-fluid"
                                                                            style="width: 20px; height: 20px;">
                                                                        {{ $item->bedrooms }} bedrooms
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </h2>
                                                <div id="collapse{{ $index }}"
                                                    class="accordion-collapse collapse {{ $index === 0 ? 'show' : '' }}"
                                                    aria-labelledby="heading{{ $index }}"
                                                    data-bs-parent="#accordionExample">
                                                    <div class="accordion-body">
                                                        @if ($item->image)
                                                            @php
                                                                $ext = strtolower(pathinfo($item->image, PATHINFO_EXTENSION));
                                                            @endphp

                                                            @if ($ext === 'pdf')
                                                                <a href="{{ asset($item->image) }}" target="_blank" class="btn btn-outline-primary">
                                                                    View PDF
                                                                </a>
                                                            @else
                                                                <div class="mt-2">
                                                                    <img src="{{ asset($item->image) }}"
                                                                        class="img-fluid me-2"
                                                                        style="width: 100%; object-fit: cover;">
                                                                </div>
                                                            @endif
                                                        @endif
                                                    </div>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                </div> --}}
                            </div>
<style>

.otp-input-group {
display: flex;
gap: 5px;
}
.otp-input-group > input {
flex-grow: 1;
text-align: center;
}
.resend-otp a {
color: #dc3545;
text-decoration: none;
font-weight: 500;
font-size: 0.85rem;
}

/* ------------------- TAB STYLING ------------------- */
.nav-tabs {
border-bottom: none;
display: flex;
justify-content: space-around;
padding-left: 0;
margin-bottom: 25px;
}
.nav-item {
font-size: 1.25rem;
}
.nav-tabs .nav-link {
color: #6c757d;
border: none;
padding: 10px 15px;
background: transparent;
font-weight: 500;
}
.nav-tabs .nav-link.active {
color: #1a437c;
border-color: transparent;
border-bottom: 2px solid #1a437c;
background: transparent;
}
 #property_name-signup,#property_name-login {
        border-radius: 5px 0 0 5px;
    }
</style>

<div class="col-lg-5">
    <div id="stickyBox" class="sticky-top" style="top: 20px;">
        <div class="property-section card mb-4 border-0 shadow-sm" style="background-color: #f7f7f7;">
            <div class="card-body">
                <div class="contact-form-container">
                    
                    @php
                        // Check if customer is logged in
                        $customer = null;
                        if (session('customer_id')) {
                            $customer = DB::table('customer_list')->where('id', session('customer_id'))->first();
                        }
                    @endphp
                    <h5 class="mb-3 fw-bold" id="form-title">
                        @if($customer)
                            Request Info
                        @else
                            Login/Signup to Request Info
                        @endif
                    </h5>
@if(session('enquiry_success'))
<div class="alert alert-success alert-dismissible fade show" role="alert">
    <strong>✅ Enquiry Submitted Successfully!</strong><br>
    <strong>Property Owner:</strong> {{ session('owner_name') }}<br>
    <strong>Phone:</strong> <a href="tel:+91{{ session('owner_phone') }}">{{ session('owner_phone') }}</a><br>
    <hr>
    <small class="text-muted">The property owner has been notified and our team will reach out to you.</small>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
@endif
                    <!-- Alert Messages -->
                    <div id="form-alert"></div>

                    <!-- Main Smart Form -->
                   <form id="smart-enquiry-form" method="POST">
    @csrf
    <div class="row g-3">

        <!-- Property Name (Always Locked) -->
        <div class="col-md-12 mt-2">
            <label for="property_name" class="form-label required">Property Name</label>
            <div class="input-group">
                <input type="hidden" id="owner-phone" value="{{ $property->customer->phone ?? '' }}">
<input type="hidden" id="owner-name" value="{{ $property->customer->first_name ?? '' }}">

                <input type="hidden" name="pro_id" value="{{ $property->id ?? '' }}">
                <input type="hidden" name="pro_cus" value="{{ $property->customer_id ?? '' }}">
                <input type="text" class="form-control" id="property_name" name="property_name"
                    value="{{ $property->name ?? 'Property Name' }}" readonly
                    style="background-color: #dddddd; border-radius: 5px 0 0 5px;">
                <span class="input-group-text" style="background-color: #dddddd">
                    <i class="fas fa-lock text-muted"></i>
                </span>
            </div>
        </div>

        @if(!$customer)
        <!-- Phone Number + Send OTP (Only for non-logged in users) -->
        <div class="col-md-12 mt-2" id="phone-section">
            <label for="phone" class="form-label required">Phone Number</label>
            <div class="d-flex">
                <div class="input-group me-2">
                    <span class="input-group-text">+91</span>
                    <input type="text" class="form-control" id="phone" name="phone"
                        placeholder="Enter 10-digit mobile number" required maxlength="10" autocomplete="off">
                </div>
                <button type="button" class="btn btn-primary btn-sm otp-action-btn flex-shrink-0" id="send-otp-btn">
                    <span class="btn-text">Send OTP</span>
                </button>
            </div>
            <div class="text-danger mt-1" id="phone-error" style="display:none;"></div>
        </div>

        <!-- OTP Input Section (Hidden by default) -->
        <div class="col-md-12 mt-2" id="otp-section" style="display:none;">
            <label class="form-label required">Enter OTP</label>
            <div class="otp-input-group d-flex gap-2">
                <input type="text" class="otp-input form-control text-center" maxlength="1" data-index="0"
                    autocomplete="off">
                <input type="text" class="otp-input form-control text-center" maxlength="1" data-index="1"
                    autocomplete="off">
                <input type="text" class="otp-input form-control text-center" maxlength="1" data-index="2"
                    autocomplete="off">
                <input type="text" class="otp-input form-control text-center" maxlength="1" data-index="3"
                    autocomplete="off">
            </div>
            <div class="text-danger mt-1" id="otp-error" style="display:none;"></div>
            <div class="resend-otp mt-2" id="resend-section" style="display:none;">
                <span class="text-muted">Didn't receive OTP?</span>
                <a href="#" id="resend-otp-link" class="ms-1">Resend OTP</a>
                <span id="countdown" class="ms-2 text-primary" style="display:none;"></span>
            </div>
        </div>

        <div id="registration-fields" class="row" style="display:none;">
            <!-- Phone Number (Verified & Locked) -->
            <div class="col-md-6 mt-2">
                <label for="phone-verified" class="form-label required">Phone Number</label>
                <div class="input-group">
                    <span class="input-group-text" style="background-color: #e9ecef;">+91</span>
                    <input type="text" class="form-control" id="phone-verified" readonly
                        style="background-color: #e9ecef; color: #6c757d;">
                    <span class="input-group-text" style="background-color: #e9ecef;">
                        <i class="fas fa-lock text-muted"></i>
                    </span>
                </div>
                <a href="#" id="change-number-link" class="text-primary" style="font-size: 12px;">change number</a>
            </div>

            <!-- Full Name -->
            <div class="col-md-6 mt-2">
                <label for="name" class="form-label required">Name</label>
                <input type="text" class="form-control" id="name" name="name"
                    placeholder="Enter your full name">
            </div>

            <!-- Email -->
            <div class="col-md-12 mt-2">
                <label for="email" class="form-label required">Email</label>
                <input type="email" class="form-control" id="email" name="email"
                    placeholder="Enter your email address">
            </div>

            <!-- State & City in one row -->
            <div class="col-md-6 mt-2">
                <label for="state" class="form-label required">State</label>
                <select id="state" name="state" class="form-select">
                    <option value="">Select State</option>
                    @foreach ($states as $state)
                        <option value="{{ $state->id }}">{{ $state->name }}</option>
                    @endforeach
                </select>
            </div>

            <div class="col-md-6 mt-2">
                <label for="city" class="form-label required">City</label>
                <select id="city" name="city" class="form-select">
                    <option value="">Select City</option>
                </select>
            </div>
        </div>

        <!-- Existing User Info (Show after login via OTP) -->
        <div id="existing-user-info" style="display:none;">
            <div class="row">
                <div class="col-md-6 mt-2">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" id="existing-name" name="name" readonly
                        style="background-color: #dddddd;">
                </div>
                <div class="col-md-6 mt-2">
                    <label class="form-label">Phone</label>
                    <div class="input-group">
                        <span class="input-group-text" style="background-color: #dddddd;">+91</span>
                        <input type="text" class="form-control" id="existing-phone" name="phone" readonly
                            style="background-color: #dddddd;">
                    </div>
                </div>
                <div class="col-md-12 mt-2">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" id="existing-email" name="email" readonly
                        style="background-color: #dddddd;">
                </div>
            </div>
        </div>

        @else
        <!-- Logged In User Info (Show customer details) -->
        <div class="col-md-6 mt-2">
            <label class="form-label">Name</label>
            <input type="text" class="form-control" value="{{ $customer->first_name }}" readonly
                style="background-color: #dddddd">
            <input type="hidden" name="name" value="{{ $customer->first_name }}">
        </div>
        <div class="col-md-6 mt-2">
            <label class="form-label">Phone</label>
            <div class="input-group">
                <span class="input-group-text" style="background-color: #dddddd">+91</span>
                <input type="text" class="form-control" value="{{ $customer->phone }}" readonly
                    style="background-color: #dddddd">
                <input type="hidden" name="phone" value="{{ $customer->phone }}">
            </div>
        </div>
        <div class="col-md-12 mt-2">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" value="{{ $customer->email }}" readonly
                style="background-color: #dddddd">
            <input type="hidden" name="email" value="{{ $customer->email }}">
        </div>
        @endif

        <div class="col-md-12 mt-2" id="message-section" 
            @if(!$customer) style="display:none;" @endif>
            <label class="form-label">Do you have anything on mind ?</label>
            <textarea class="form-control" name="message" id="message"
                placeholder="I'm interested in your property..."
                style="height: 90px;">I'm interested in your property...</textarea>
        </div>

        <!-- Terms & Conditions -->
        <div class="col-md-12 mt-2">
            <small class="text-muted">
                <input type="checkbox" id="terms" required>
                By clicking you agree to our <a href="#" target="_blank">Terms & Conditions</a>
            </small>
        </div>


<div class="col-md-12 mt-2" id="cooldown-alert" style="display:none;">
    <div class="p-3 rounded" style="background-color: #c6f7b4; border: 1px solid #f7dc6f;">
        <h6 class="mb-2" style="color: #29327b; font-weight:600;">
            <i class="fas fa-clock me-1"></i> Please Wait! You can enquire again later.
        </h6>

        <div class="mt-2" style="font-size: 15px;">
            <p class="mb-1"><strong>Property Owner:</strong> <span id="cooldown-owner">--</span></p>
            <p class="mb-1"><strong>Phone Number:</strong> <a href="#" id="cooldown-phone" target="_blank">--</a></p>
            <hr class="my-2">
            <p class="mb-1"><strong>Last Enquiry:</strong> <span id="last-enquiry-time">--</span></p>
            <p class="mb-0"><strong>Next Enquiry In:</strong> <span id="remaining-time">--</span></p>
        </div>

        <div class="mt-2" style="font-size: 13px; color:#6c757d;">
            <em>Note:</em> You’ve already submitted an enquiry for this property.  
            Please wait until the cooldown period ends before sending another.
        </div>
    </div>
</div>


<!-- Submit Button -->
<div class="col-md-12 mt-3">
    <div class="d-grid gap-2">
        <button type="submit" class="btn btn-primary btn-lg" id="submit-btn"
            @if(!$customer) disabled @endif>
            Verify and Enquire
        </button>
    </div>
</div>
    </div>
</form>


                </div>
            </div>
        </div>
    </div>
</div>
<script>
    const THANK_YOU_URL = "{{ route('agentform.thankyou') }}";
    const DETAILS_URL = "{{ route('projects.details', ['id' => $property->id, 'permalink' => $property->permalink ?? null]) }}";
</script>

<style>
.otp-input {
    width: 50px;
    height: 50px;
    font-size: 24px;
    font-weight: bold;
}
.otp-input:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
.otp-input.filled {
    background-color: #e7f3ff;
}
</style>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
@section('scripts')

<script>
$(document).ready(function() {
    const isLoggedIn = {{ $customer ? 'true' : 'false' }};
    const propertyId = {{ $property->id ?? 'null' }}; 
    
    let userExists = isLoggedIn;
    let otpVerified = isLoggedIn;
    let newCustomerId = null;

function toggleFormFields(hidden) {
    $('#smart-enquiry-form .row > div')
        .not(':has(#property_name), #cooldown-alert, :has(#submit-btn)')
        .toggleClass('d-none', hidden);
}
    function checkEnquiryCooldown(phone) {
        if (!phone || !propertyId) return;

        $.ajax({
            url: "{{ route('check.enquiry.status') }}",
            method: 'POST',
            data: {
                phone: phone,
                pro_id: propertyId,
                _token: '{{ csrf_token() }}'
            },
            success: function(response) {
if (response.can_enquire) {
    $('#submit-btn').removeClass('d-none').prop('disabled', false);
    $('#cooldown-alert').hide();
    toggleFormFields(false); 
} else {
    $('#submit-btn').addClass('d-none');
    $('#cooldown-alert').fadeIn();
    toggleFormFields(true); 


    
    (function() {
        var mins = parseInt(response.remaining_minutes) || 0;
        var label;
        if (mins >= 1440) {
            var days  = Math.floor(mins / 1440);
            var hours = Math.floor((mins % 1440) / 60);
            var rem   = mins % 60;
            label = days + ' day' + (days > 1 ? 's' : '');
            if (hours > 0) label += ' ' + hours + ' hr' + (hours > 1 ? 's' : '');
            if (rem > 0)   label += ' ' + rem + ' min' + (rem > 1 ? 's' : '');
        } else if (mins >= 60) {
            var hours = Math.floor(mins / 60);
            var rem   = mins % 60;
            label = hours + ' hr' + (hours > 1 ? 's' : '');
            if (rem > 0) label += ' ' + rem + ' min' + (rem > 1 ? 's' : '');
        } else {
            label = mins + ' minute' + (mins !== 1 ? 's' : '');
        }
        $('#remaining-time').text(label);
    })();
    $('#last-enquiry-time').text(response.last_enquiry_time || '--');
const ownerId = $('input[name="pro_cus"]').val();
const ownerName = $('#owner-name').val();  
let ownerPhone = $('#owner-phone').val(); 
if ($('#owner-phone').length) {
    ownerPhone = $('#owner-phone').val();
} else if (typeof OWNER_PHONE !== 'undefined') {
    ownerPhone = OWNER_PHONE;
}
$('#cooldown-owner').text(ownerName || 'Unknown Owner');
$('#cooldown-phone')
    .attr('href', 'tel:+91' + ownerPhone)
    .text(ownerPhone ? '+91 ' + ownerPhone : '--');
    let remaining = parseInt(response.remaining_minutes);
    function formatRemaining(mins) {
        if (mins >= 1440) {
            var d = Math.floor(mins / 1440);
            var h = Math.floor((mins % 1440) / 60);
            var m = mins % 60;
            var s = d + ' day' + (d > 1 ? 's' : '');
            if (h > 0) s += ' ' + h + ' hr' + (h > 1 ? 's' : '');
            if (m > 0) s += ' ' + m + ' min' + (m > 1 ? 's' : '');
            return s;
        } else if (mins >= 60) {
            var h = Math.floor(mins / 60);
            var m = mins % 60;
            var s = h + ' hr' + (h > 1 ? 's' : '');
            if (m > 0) s += ' ' + m + ' min' + (m > 1 ? 's' : '');
            return s;
        } else {
            return mins + ' minute' + (mins !== 1 ? 's' : '');
        }
    }
    const countdownInterval = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
            clearInterval(countdownInterval);
            $('#cooldown-alert').hide();
            $('#submit-btn').removeClass('d-none').prop('disabled', false);
            toggleFormFields(false);
        } else {
            $('#remaining-time').text(formatRemaining(remaining));
        }
    }, 60000);
}

            }
        });
    }
    if (isLoggedIn) {
        @if($customer)
            checkEnquiryCooldown('{{ $customer->phone }}');
        @endif
    }

    // ==================== SEND OTP ====================
    $('#send-otp-btn').on('click', function() {
        const phone = $('#phone').val().trim();
        const btn = $(this);
        const btnText = btn.find('.btn-text');

        // Validation
        if (!/^[0-9]{10}$/.test(phone)) {
            showError('phone-error', 'Please enter a valid 10-digit phone number');
            return;
        }
        hideError('phone-error');

        // Loading state
        btn.prop('disabled', true);
        btnText.html('<span class="spinner-border spinner-border-sm me-1"></span>Sending...');

        // Send OTP using your existing route
        $.ajax({
            url: "{{ route('customer.send.otp.registration') }}",
            method: 'POST',
            data: {
                phone: phone,
                type: 'smart_login',
                _token: '{{ csrf_token() }}'
            },
            success: function(response) {
                if (response.success) {
                    $('#otp-section').slideDown();
                    $('#resend-section').show();
                    startCountdown();
                    showAlert('success', response.message || 'OTP sent successfully!');
                    $('.otp-input').first().focus();
                } else {
                    showError('phone-error', response.message || 'Failed to send OTP');
                }
            },
            error: function(xhr) {
                const res = xhr.responseJSON || {};
                if (res.status === 409) {
                    $('#otp-section').slideDown();
                    $('#resend-section').show();
                    startCountdown();
                    showAlert('info', 'Please verify OTP to continue');
                    $('.otp-input').first().focus();
                } else {
                    showError('phone-error', res.message || 'Failed to send OTP. Please try again.');
                }
            },
            complete: function() {
                btn.prop('disabled', false);
                btnText.text('Send OTP');
            }
        });
    });

    // ==================== OTP INPUT HANDLING ====================
    $('.otp-input').on('input', function() {
        const $this = $(this);
        const index = parseInt($this.data('index'));
        
        $this.val($this.val().replace(/[^0-9]/g, ''));
        
        if ($this.val().length === 1) {
            $this.addClass('filled');
            if (index < 3) {
                $('.otp-input[data-index="' + (index + 1) + '"]').focus();
            } else {
                verifyOTP();
            }
        } else {
            $this.removeClass('filled');
        }
    });

    $('.otp-input').on('keydown', function(e) {
        const $this = $(this);
        const index = parseInt($this.data('index'));
        if (e.key === 'Backspace' && $this.val() === '' && index > 0) {
            $('.otp-input[data-index="' + (index - 1) + '"]').focus();
        }
    });

    // ==================== VERIFY OTP ====================
    function verifyOTP() {
        const phone = $('#phone').val().trim();
        const otp = getOTPValue();
        
        if (otp.length !== 4) {
            showError('otp-error', 'Please enter complete OTP');
            return;
        }
        hideError('otp-error');

        $.ajax({
            url: "{{ route('customer.verify.otp.for.enquiry') }}",
            method: 'POST',
            data: {
                phone: phone,
                otp: otp,
                _token: '{{ csrf_token() }}'
            },
            success: function(response) {
                if (response.success) {
                    otpVerified = true;
                    
                    if (response.customer) {
                        //  EXISTING USER - Show their details
                        userExists = true;
                        showExistingUserInfo(response.customer);
                        showAlert('success', 'Welcome back, ' + response.customer.name + '!');
                        updateHeaderLoginState(response.customer.name);
                    } else {
                        //  NEW USER - Show registration fields
                        userExists = false;
                        showRegistrationFields();
                        showAlert('info', 'Please complete your registration to continue');
                    }
                     $('#otp-section').slideUp();
                    $('#resend-section').hide();
                    // Lock phone number
                    $('#phone').prop('readonly', true);
                    $('#send-otp-btn').prop('disabled', true).text('Verified ✓');
                    
                } else {
                    showError('otp-error', response.message || 'Invalid OTP');
                    clearOTP();
                }
            },
            error: function(xhr) {
                const res = xhr.responseJSON || {};
                showError('otp-error', res.message || 'Failed to verify OTP');
                clearOTP();
            }
        });
    }

    // ==================== UPDATE HEADER AFTER OTP LOGIN ====================
    function updateHeaderLoginState(customerName) {
        var dashboardUrl = '{{ url("customer/dashboard") }}';
        var userHtml = '<ul class="navbar-nav">' +
            '<li class="nav-item user-dropdown-hover position-relative">' +
                '<a class="nav-link btn-default user-btn d-flex align-items-center" href="' + dashboardUrl + '" ' +
                'style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:inline-block;">' +
                '<i class="fas fa-user me-2"></i> Hi ' + customerName + '</a>' +
            '</li></ul>';
        $('.user-menu-container').html(userHtml);
    }

    // ==================== SHOW EXISTING USER INFO ====================
    function showExistingUserInfo(customer) {
        // Populate all fields
        $('#existing-name').val(customer.name || customer.first_name || '');
        $('#existing-phone').val(customer.phone || $('#phone').val() || '');
        $('#existing-email').val(customer.email || '');

        // Hide OTP/phone input, show user fields
        $('#phone-section').slideUp();
        $('#otp-section').slideUp();
        $('#registration-fields').hide();
        $('#existing-user-info').slideDown();
        $('#message-section').slideDown();

        // Change title
        $('#form-title').text('Request Info');

        // Hide the "Welcome back" alert after a moment
        setTimeout(function() { $('#form-alert').slideUp(); }, 2000);

        // Check cooldown before enabling submit
        $('#submit-btn').prop('disabled', false).text('Submit Enquiry');
        checkEnquiryCooldown(customer.phone || $('#phone').val());
    }
    function showRegistrationFields() {
        //  Hide OTP section
        $('#otp-section').slideUp();
        $('#resend-section').hide();
        
        //  Hide original phone input section
        $('#phone-section').slideUp();
        
        //  Show phone number as locked in registration form
        $('#phone-verified').val($('#phone').val());
        
        //  Show registration fields
        $('#registration-fields').slideDown();
        $('#existing-user-info').hide();
         $('#message-section').slideDown();
        $('#submit-btn').prop('disabled', false).text('Register and Enquire');
    }

    // ==================== CHANGE NUMBER LINK ====================
    $('#change-number-link').on('click', function(e) {
        e.preventDefault();
        
        // Reset everything
        $('#registration-fields').slideUp();
        $('#otp-section').slideUp();
        $('#phone-section').slideDown(); // ✅ Show phone input again
        $('#phone').val('').prop('readonly', false);
        $('#send-otp-btn').prop('disabled', false).text('Send OTP');
        $('.otp-input').val('').removeClass('filled');
        $('#name').val('');
        $('#email').val('');
        $('#state').val('');
        $('#city').html('<option value="">Select City</option>');
        
        otpVerified = false;
        userExists = false;
        $('#submit-btn').prop('disabled', true).text('Verify and Enquire');
        
        showAlert('info', 'Please enter a new phone number');
    });

    // ==================== STATE & CITY DROPDOWN ====================
    $('#state').on('change', function() {
        const stateId = $(this).val();
        $('#city').html('<option value="">Select City</option>');
        
        if (stateId) {
            $.get('/getcities/' + stateId, function(data) {
                $.each(data, function(key, city) {
                    $('#city').append('<option value="' + city.id + '">' + city.name + '</option>');
                });
            });
        }
    });

    // ==================== RESEND OTP ====================
    $('#resend-otp-link').on('click', function(e) {
        e.preventDefault();
        clearOTP();
        $('#send-otp-btn').click();
    });

    // ==================== COUNTDOWN TIMER ====================
    function startCountdown() {
        let timeLeft = 60;
        const $countdown = $('#countdown');
        const $resendLink = $('#resend-otp-link');
        
        $resendLink.hide();
        $countdown.show();
        
        const timer = setInterval(function() {
            $countdown.text(`Resend in ${timeLeft}s`);
            timeLeft--;
            
            if (timeLeft < 0) {
                clearInterval(timer);
                $countdown.hide();
                $resendLink.show();
            }
        }, 1000);
    }

    // ==================== FORM SUBMISSION ====================
    $('#smart-enquiry-form').on('submit', function(e) {
        e.preventDefault();
        
        // If logged in, directly submit enquiry (no OTP check)
        if (isLoggedIn) {
            submitEnquiryLoggedIn();
            return;
        }
        
        // For non-logged in users, check OTP verification
        if (!otpVerified) {
            showAlert('error', 'Please verify OTP first');
            return;
        }

        if (userExists) {
            // Existing user - Direct enquiry
            submitEnquiry();
        } else {
            // New user - Register first, then enquiry
            registerAndEnquire();
        }
    });

    // ==================== SUBMIT ENQUIRY (LOGGED IN USER) ====================
    function submitEnquiryLoggedIn() {
        const formData = new FormData($('#smart-enquiry-form')[0]);

        $.ajax({
            url: "{{ route('agentform.create') }}",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
           success: function(response) {
    if (response.status === 'success') {
        const params = new URLSearchParams({
            status: 'success',
            owner_name: response.owner_name || '',
            owner_phone: response.owner_phone || '',
            property_name: $('#property_name').val() || '',
            redirect: DETAILS_URL
        });
        window.location.href = `${THANK_YOU_URL}?${params.toString()}`;
    } else {
        showAlert('error', response.message || 'Enquiry submission failed');
    }
},

            error: function(xhr) {
                const res = xhr.responseJSON || {};
                if (xhr.status === 403 && res.status === 'fail') {
                    var modal = new bootstrap.Modal(document.getElementById('noPackageModal'));
                    modal.show();
                } else {
                    showAlert('error', res.message || 'Form submission failed');
                }
            }
        });
    }

    // ==================== REGISTER NEW USER ====================
    function registerAndEnquire() {
        const formData = {
            first_name: $('#name').val(),
            phone: $('#phone').val(),
            email: $('#email').val(),
            state: $('#state').val(),
            city: $('#city').val(),
            _token: '{{ csrf_token() }}'
        };

        $.ajax({
            url: "{{ route('customer_property.register.submit') }}",
            type: "POST",
            data: formData,
            success: function(response) {
                if (response.success) {
                    newCustomerId = response.customer.id;
                    showAlert('success', 'Registration successful!');
                    
                    // Now submit enquiry
                    submitEnquiry(newCustomerId);
                } else {
                    showAlert('error', response.message || 'Registration failed');
                }
            },
            error: function(xhr) {
                const res = xhr.responseJSON || {};
                let errMsg = res.message || 'Registration failed';
                if (res.errors) {
                    errMsg = Object.values(res.errors).flat().join('<br>');
                }
                showAlert('error', errMsg);
            }
        });
    }

    // ==================== SUBMIT ENQUIRY ====================
    function submitEnquiry(customerId = null) {
        const formData = new FormData();
        
        formData.append('_token', '{{ csrf_token() }}');
        formData.append('phone', $('#phone').val());
        formData.append('pro_id', $('input[name="pro_id"]').val());
        formData.append('pro_cus', $('input[name="pro_cus"]').val());
        formData.append('property_name', $('#property_name').val());
        formData.append('message', $('#message').val());

        
        if (userExists) {
            // Existing user
            formData.append('name', $('#existing-name').val());
            formData.append('email', $('#existing-email').val());
        } else {
            // New user
            formData.append('name', $('#name').val());
            formData.append('email', $('#email').val());
            formData.append('enquiry_customer_id', customerId || newCustomerId);
        }

        const url = userExists ? "{{ route('agentform.create') }}" : "{{ route('agentform.create.signup') }}";

        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
           success: function(response) {
    if (response.status === 'success') {
        const params = new URLSearchParams({
            status: 'success',
            owner_name: response.owner_name || '',
            owner_phone: response.owner_phone || '',
            property_name: $('#property_name').val() || '',
            redirect: DETAILS_URL
        });
        window.location.href = `${THANK_YOU_URL}?${params.toString()}`;
    } else {
        showAlert('error', response.message || 'Enquiry submission failed');
    }
},

            error: function(xhr) {
                const res = xhr.responseJSON || {};
                if (xhr.status === 403 && res.status === 'fail') {
                    var modal = new bootstrap.Modal(document.getElementById('noPackageModal'));
                    modal.show();
                } else {
                    showAlert('error', res.message || 'Form submission failed');
                }
            }
        });
    }

    // ==================== HELPER FUNCTIONS ====================
    function getOTPValue() {
        let otp = '';
        $('.otp-input').each(function() {
            otp += $(this).val();
        });
        return otp;
    }

    function clearOTP() {
        $('.otp-input').val('').removeClass('filled');
        $('.otp-input').first().focus();
    }

    function showError(id, message) {
        $('#' + id).text(message).show();
    }

    function hideError(id) {
        $('#' + id).hide();
    }

    function showAlert(type, message) {
        const alertClass = type === 'success' ? 'alert-success' : (type === 'info' ? 'alert-info' : 'alert-danger');
        const alertHtml = `<div class="alert ${alertClass} alert-dismissible fade show">${message}</div>`;
        $('#form-alert').html(alertHtml);
        
        setTimeout(() => {
            $('#form-alert .alert').fadeOut();
        }, 5000);
    }
});
</script>
    <script src="https://cdn.jsdelivr.net/npm/lightbox2@2.11.4/dist/js/lightbox.min.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const stickyBox = document.getElementById("stickyBox");
            const footer = document.getElementById("pageFooter");
            if (!stickyBox || !footer) return;
            const offsetTop = 20; // match the "top" value in style
            const stickyHeight = stickyBox.offsetHeight;
            window.addEventListener("scroll", function() {
                const scrollY = window.scrollY || window.pageYOffset;
                const footerTop = footer.getBoundingClientRect().top + window.scrollY;
                if (scrollY + stickyHeight + offsetTop >= footerTop) {
                    stickyBox.style.position = "absolute";
                    stickyBox.style.top = (footerTop - stickyHeight - stickyBox.offsetParent.offsetTop -
                        offsetTop) + "px";
                } else {
                    stickyBox.style.position = "sticky";
                    stickyBox.style.top = offsetTop + "px";
                }
            });
        });
    </script>



    <script>
        let swiper;
        function initializeSwiper() {
            swiper = new Swiper('.mySwiper', {
                slidesPerView: 1,
                spaceBetween: 10,
                centeredSlides: true,
                loop: true,
                // loopedSlides: 4, // Ensures loop works with few slides
                navigation: {
                    nextEl: '.swiper_right',
                    prevEl: '.swiper_left',
                },
                breakpoints: {
                    0: {
                        slidesPerView: 3
                    },
                    768: {
                        slidesPerView: 3
                    },
                    1200: {
                        slidesPerView: 3
                    }
                }
            });
        }
        function shuffleSlides() {
            swiper.slides.forEach(slide => {
            });
            swiper.update();
        }
        document.addEventListener('DOMContentLoaded', function() {
            initializeSwiper();
            // Attach shuffle on navigation clicks
            document.querySelector('.swiper_right').addEventListener('click', shuffleSlides);
            document.querySelector('.swiper_left').addEventListener('click', shuffleSlides);
        });
    </script>
  
        <script>
        $('.wishlist-toggle').on('click', function () {
            const button = $(this);
            const propertyId = button.data('id');
            const isInWishlist = button.data('in-wishlist') == '1';

            const url = isInWishlist
                ? '/wishlist/remove/' + propertyId
                : '/wishlist/add/' + propertyId;

            $.get(url, function (response) {
                if (response.status === 'added') {
                    button.html('<i class="fas fa-heart text-red-500" style="color: red;"></i>');
                    button.data('in-wishlist', '1');
                } else if (response.status === 'removed') {
                    button.html('<i class="far fa-heart"></i>');
                    button.data('in-wishlist', '0');
                }
            });
        });

    </script>

<!-- No Package Modal -->
<div class="modal fade" id="noPackageModal" tabindex="-1" aria-labelledby="noPackageModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border-radius: 12px; border: none; box-shadow: 0 10px 40px rgba(0,0,0,0.15);">
            <div class="modal-body text-center py-5 px-4">
                <div class="mb-3">
                    <i class="fas fa-box-open" style="font-size: 3rem; color: #163D75;"></i>
                </div>
                <h5 class="fw-bold mb-2" style="color: #163D75;">No Active Package Found</h5>
                <p class="text-muted mb-4" style="font-size: 15px;">
                    You don't have any active rent/lease package.<br>Please buy a plan to view owner details.
                </p>
                <a href="{{ route('dashboard.section', ['type' => 'credits']) }}?filter=rent" class="btn w-100 py-2 fw-semibold" style="background-color: #163D75; color: #fff; border-radius: 8px; font-size: 15px;">
                    <i class="fas fa-shopping-cart me-2"></i> Buy a Rent/Lease Package
                </a>
                <button type="button" class="btn btn-link mt-2 text-muted text-decoration-none" data-bs-dismiss="modal" style="font-size: 14px;">
                    Maybe later
                </button>
            </div>
        </div>
    </div>
</div>

<script>
    const swiper = new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper_right',
            prevEl: '.swiper_left',
        },
        loop: true,
    });
</script>

<script>
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'albumLabel': "" // removes "Image X of Y"
    });
</script>
<script>
    const customFields = @json($property->custom_fields);

    const filteredFields = customFields.filter(field => {
        const name = field.field_name?.toLowerCase() || '';
        return name.includes('area') || name.includes('length') || name.includes('breadth') || name.includes('carpet');
    });

    console.log("Filtered Square Details:", customFields);
</script>



@endsection