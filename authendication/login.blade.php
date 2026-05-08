@extends('website.layouts.app')

@section('title', 'Login - Houselink360')
@section('seo_desc', 'Login to your Houselink360 account. Access your property listings, saved favorites, and manage your real estate portfolio with ease.')

@section('head')
<link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css">
<link rel="canonical" href="{{ url()->current() }}" />
<meta name="robots" content="index, follow">
@endsection

@section('styles')
<style>
    :root {
        --main-color: #2c2ccc;
        --main-color-hover: #2323a2;
        --body-background: #f5f5f5;
        --text-color: #333;
        --box-bg-color: #fff;
        --box-shadow-color: #e4e4e4;
        --border-color: #ced4da;
    }

    .page-header {
        background: url("https://html.awaikenthemes.com/inspaire/images/page-header-bg.jpg") no-repeat center center;
        
    }

    .breadcrumb {
        background: transparent;
        padding: 0;
        margin-bottom: 0;
    }

    .auth-wrapper {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--body-background);
        padding: 40px 0;
    }

    .auth-card {
        border: none;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 3px 3px 6px 0px var(--box-shadow-color);
        max-width: 900px;
        width: 100%;
    }

    .auth-left {
        background: url("{{ asset('assets/images/footer/login_image.png') }}") no-repeat center center;
        background-size: cover;
        border-radius: 8px 0 0 8px;
    }

    .input-wrapper {
        margin-bottom: 20px;
        position: relative;
    }

    .input-wrapper label {
        display: block;
        margin-bottom: 10px;
        font-size: 14px;
    }

    .input-wrapper input {
        width: 100%;
        height: 40px;
        padding: 0 10px;
        border-radius: 5px;
        border: 1px solid var(--border-color);
        background-color: transparent;
        color: var(--text-color);
    }

    .input-wrapper .icon {
        position: absolute;
        bottom: 10px;
        right: 10px;
        font-size: 18px;
        cursor: pointer;
        color: #6b6b6b;
    }

    button[type="submit"] {
        width: 100%;
        padding: 10px;
        background: var(--main-color);
        border: none;
        color: #fff;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
    }

    button[type="submit"]:hover {
        background: var(--main-color-hover);
    }

    /* Login Method Toggle - COMMENTED OUT
    .login-method-toggle {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        padding: 4px;
    }

    .toggle-btn {
        flex: 1;
        padding: 8px 16px;
        border: none;
        background: transparent;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    }

    .toggle-btn.active {
        background: #163d75;
        color: white;
    }

    .toggle-btn:not(.active) {
        color: #6c757d;
    }

    .toggle-btn:not(.active):hover {
        background: #e9ecef;
    } */

    /* OTP Input Styling */
    .otp-input-group {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-bottom: 20px;
    }

    .otp-input {
        width: 50px;
        height: 50px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        border: 2px solid #ddd;
        border-radius: 8px;
        background: white;
        transition: all 0.3s ease;
    }

    .otp-input:focus {
        border-color: #163d75;
        outline: none;
        box-shadow: 0 0 0 3px rgba(22, 61, 117, 0.1);
    }

    .otp-input.filled {
        border-color: #4f8bd3;
        background: #f8fff9;
    }

    /* Send OTP Button */
    .send-otp-btn {
        background: #163d75;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
    }

    .send-otp-btn:hover {
        background: #4f8bd3;
    }

    .send-otp-btn:disabled {
        background: #6c757d;
        cursor: not-allowed;
    }

    /* Resend OTP */
    .resend-otp {
        text-align: center;
        margin-top: 15px;
        font-size: 14px;
        color: #6c757d;
    }

    .resend-otp a {
        color: #163d75;
        text-decoration: none;
        cursor: pointer;
    }

    .resend-otp a:hover {
        text-decoration: underline;
    }

    .resend-otp .countdown {
        color: #dc3545;
        font-weight: bold;
    }

    /* Loading Spinner */
    /* .loading {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #163d75;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 8px;
    } */

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* Form Sections */
    .form-section {
        display: none;
    }

    .form-section.active {
        display: block;
    }

    @media (max-width: 767px) {
        .auth-left {
            display: none;
        }
        .auth-wrapper{
            padding: 3%;
        }
        .otp-input-group {
            gap: 8px;
        }
        .otp-input {
            width: 45px;
            height: 45px;
            font-size: 16px;
        }
    }
</style>
@endsection

@section('content')

<!-- Page Header Start -->
<div class="page-header parallaxie">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="page-header-box">
                    <h1 class="text-anime-style-2" data-cursor="-opaque">Login & Register</h1>
                    <nav>
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="{{ route('index') }}">Home</a></li>
                            <li class="breadcrumb-item active" aria-current="page">Sign In</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Page Header End -->

<div class="auth-wrapper">
    <div class="card auth-card">
        <div class="row g-0">
            <!-- Left Side Image -->
            <div class="col-md-6 auth-left d-none d-md-block"></div>

            <!-- Right Side Login Form -->
            <div class="col-md-6 bg-white p-4">
                <h3 class="text-center mb-3">Login</h3>
                <h5 class="text-center text-muted mb-3">Welcome Back!</h5>
               
                @if(session('success'))
                    <div class="alert alert-success mt-2">{{ session('success') }}</div>
                @endif
                @if(session('error'))
                    <div class="alert alert-danger mt-2">{{ session('error') }}</div>
                @endif

                <!-- Login Method Toggle - COMMENTED OUT
                <div class="login-method-toggle">
                    <button type="button" class="toggle-btn active" data-method="password">Password</button>
                    <button type="button" class="toggle-btn" data-method="otp">OTP</button>
                </div> -->

                <!-- Password Login Form - COMMENTED OUT
                <div class="form-section active" id="password-form">
                    <form method="POST" action="{{ route('customer.login.submit') }}">
                        @csrf
                        <div class="input-wrapper">
                            <label for="phone">Phone Number</label>
                            <input name="phone" type="number" id="phone" value="{{ old('phone') }}" placeholder="Enter your phone number">
                            @error('phone')
                                <div class="text-danger">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="input-wrapper">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="**********">
                            <span class="icon show-pass"><i class="fi fi-rr-eye"></i></span>
                            @error('password')
                                <div class="text-danger">{{ $message }}</div>
                            @enderror
                        </div>

                        <button type="submit" class="btn btn-primary" style="background: #163d75;">Login</button>
                    </form>
                </div> -->

                <!-- OTP Login Form -->
                <div class="form-section active" id="otp-form">
                    <div class="input-wrapper">
                        <label for="otp-phone">Phone Number <span class="text-danger">*</span></label>
                        <div style="display: flex; gap: 10px;">
                            <input type="tel" id="otp-phone" placeholder="Enter your phone number" style="flex: 1;" maxlength="10" pattern="[0-9]{10}" oninput="this.value = this.value.replace(/[^0-9]/g, '')" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                            <button type="button" class="send-otp-btn" id="send-otp-btn">
                                <span class="btn-text">Send OTP</span>
                            </button>
                        </div>
                        <div class="text-danger" id="otp-phone-error" style="display: none;"></div>
                    </div>
{{-- URL ko pakad kar rakhne ke liye Hidden Input --}}
<input type="hidden" name="redirect_url" value="{{ request('redirect_url') }}">
                    <div class="input-wrapper" id="otp-input-section" style="display: none;">
                        <label>Enter OTP</label>
                        <div class="otp-input-group">
                            <input type="tel" class="otp-input" maxlength="1" data-index="0" oninput="this.value = this.value.replace(/[^0-9]/g, '')" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                            <input type="tel" class="otp-input" maxlength="1" data-index="1" oninput="this.value = this.value.replace(/[^0-9]/g, '')" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                            <input type="tel" class="otp-input" maxlength="1" data-index="2" oninput="this.value = this.value.replace(/[^0-9]/g, '')" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                            <input type="tel" class="otp-input" maxlength="1" data-index="3" oninput="this.value = this.value.replace(/[^0-9]/g, '')" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                        </div>
                        <div class="text-danger" id="otp-error" style="display: none;"></div>
                        <div class="resend-otp" id="resend-section" style="display: none;">
                            <span>Didn't receive OTP? </span>
                            <a href="#" id="resend-otp-link">Resend OTP</a>
                            <span class="countdown" id="countdown" style="display: none;"></span>
                        </div>
                    </div>

                    <button type="button" class="btn btn-primary" id="verify-otp-btn" style="background: #163d75; display: none;">
                        <span class="btn-text">Verify & Login</span>
                    </button>
                </div>

                <p class="text-center mt-3">New to Houselink360? <a href="{{ route('customer.registration') }}">Sign Up here</a> to list your property, save your favorite listings, and explore available properties for sale and rent.</p>
            </div>
        </div>
    </div>
</div>

@endsection

@section('scripts')
<script>
$(document).ready(function () {
    // Password toggle functionality - COMMENTED OUT
    /* $('.show-pass').on('click', function () {
        const input = $(this).siblings('input');
        const icon = $(this).find('i');
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('fi-rr-eye').addClass('fi-rr-eye-crossed');
        } else {
            input.attr('type', 'password');
            icon.removeClass('fi-rr-eye-crossed').addClass('fi-rr-eye');
        }
    }); */

    // Login method toggle - COMMENTED OUT
    /* $('.toggle-btn').on('click', function() {
        const method = $(this).data('method');
        
        // Update toggle buttons
        $('.toggle-btn').removeClass('active');
        $(this).addClass('active');
        
        // Show/hide form sections
        $('.form-section').removeClass('active');
        if (method === 'password') {
            $('#password-form').addClass('active');
        } else {
            $('#otp-form').addClass('active');
        }
    }); */

    // Send OTP functionality
    $('#send-otp-btn').on('click', function() {
        const phone = $('#otp-phone').val();
        const btn = $(this);
        const btnText = btn.find('.btn-text');
        
        if (!phone || phone.length !== 10) {
            $('#otp-phone-error').text('Please enter a valid 10-digit phone number').show();
            return;
        }

        // Show loading
        btn.prop('disabled', true);
        btnText.html('<span class="loading"></span>Sending...');

        $.ajax({
            url: '{{ route("customer.send.otp") }}',
            method: 'POST',
            data: {
                phone: phone,
                _token: '{{ csrf_token() }}'
            },
            success: function(response) {
                if (response.success) {
                    $('#otp-phone-error').hide();
                    $('#otp-input-section').show();
                    $('#verify-otp-btn').show();
                    $('#resend-section').show();
                    startCountdown();
                    showAlert('success', response.message);
                } else {
                    $('#otp-phone-error').text(response.message).show();
                }
            },
            error: function(xhr) {
                const response = xhr.responseJSON;
                const message = response ? response.message : 'Failed to send OTP. Please try again.';
                $('#otp-phone-error').text(message).show();
            },
            complete: function() {
                btn.prop('disabled', false);
                btnText.text('Send OTP');
            }
        });
    });

    // OTP input handling
    $('.otp-input').on('input', function() {
        const currentIndex = parseInt($(this).data('index'));
        const value = $(this).val();
        
        if (value.length === 1) {
            $(this).addClass('filled');
            if (currentIndex < 3) {
                $('.otp-input[data-index="' + (currentIndex + 1) + '"]').focus();
            }
        } else {
            $(this).removeClass('filled');
        }
    });

    $('.otp-input').on('keydown', function(e) {
        const currentIndex = parseInt($(this).data('index'));
        
        if (e.key === 'Backspace' && $(this).val() === '' && currentIndex > 0) {
            $('.otp-input[data-index="' + (currentIndex - 1) + '"]').focus();
        }
    });

    // Verify OTP
    $('#verify-otp-btn').on('click', function() {
        const phone = $('#otp-phone').val();
        const otp = getOTPValue();
        const btn = $(this);
        const btnText = btn.find('.btn-text');
        
        if (otp.length !== 4) {
            $('#otp-error').text('Please enter the complete 4-digit OTP').show();
            return;
        }

        // Show loading
        btn.prop('disabled', true);
        btnText.html('<span class="loading"></span>Verifying...');

        $.ajax({
            url: '{{ route("customer.verify.otp") }}',
            method: 'POST',
            data: {
                phone: phone,
                otp: otp,
                redirect_url: $('input[name="redirect_url"]').val(),
                _token: '{{ csrf_token() }}'
            },
            success: function(response) {
                if (response.success) {
                    showAlert('success', response.message);
                    if (response.redirect) {
                        setTimeout(() => {
                            window.location.href = response.redirect;
                        }, 1000);
                    }
                } else {
                    $('#otp-error').text(response.message).show();
                }
            },
            error: function(xhr) {
                const response = xhr.responseJSON;
                const message = response ? response.message : 'Failed to verify OTP. Please try again.';
                $('#otp-error').text(message).show();
            },
            complete: function() {
                btn.prop('disabled', false);
                btnText.text('Verify & Login');
            }
        });
    });

    // Resend OTP
    $('#resend-otp-link').on('click', function(e) {
        e.preventDefault();
        $('#send-otp-btn').click();
    });

    // Helper functions
    function getOTPValue() {
        let otp = '';
        $('.otp-input').each(function() {
            otp += $(this).val();
        });
        return otp;
    }

    function startCountdown() {
        let timeLeft = 60;
        const countdownEl = $('#countdown');
        const resendLink = $('#resend-otp-link');
        
        resendLink.hide();
        countdownEl.show();
        
        const timer = setInterval(function() {
            countdownEl.text(`Resend in ${timeLeft}s`);
            timeLeft--;
            
            if (timeLeft < 0) {
                clearInterval(timer);
                countdownEl.hide();
                resendLink.show();
            }
        }, 1000);
    }

    function showAlert(type, message) {
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const alertHtml = `<div class="alert ${alertClass} mt-2">${message}</div>`;
        
        // Remove existing alerts
        $('.alert').remove();
        
        // Add new alert
        $('.auth-card .col-md-6.bg-white').prepend(alertHtml);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            $('.alert').fadeOut();
        }, 5000);
    }
});
</script>
@endsection