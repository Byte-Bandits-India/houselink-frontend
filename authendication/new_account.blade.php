@extends('website.layouts.app')

@section('head')
    <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css">
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
            background: url("{{ asset('assets/images/footer/login_image.png') }}") no-repeat center center;
            
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
            max-width: 1100px;
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
        bottom: 5px;
        right: 26px;
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

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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
                            <li class="breadcrumb-item active" aria-current="page">Sign Up</li>
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

            <!-- Right Side Registration Form -->
            <div class="col-md-6 bg-white p-4">
                <h3 class="text-center mb-3">Sign Up</h3>
                <h5 class="text-center text-muted">Create your account</h5>
                @if ($errors->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            @if (session('error'))
                <div class="alert alert-danger">{{ session('error') }}</div>
            @endif
            @if (session('success'))
                <div class="alert alert-success">{{ session('success') }}</div>
            @endif
           
            <form method="POST" action="{{ route('customer.register.submit') }}" id="registration-form">
                @csrf
                <div class="row">
                    <div class="input-wrapper col-md-6">
                        <label for="name">First Name <span class="text-danger">*</span></label>
                        <input name="first_name" type="text" id="name" value="{{ old('first_name') }}" placeholder="First Name" required pattern="[A-Za-z\s]+" oninput="this.value = this.value.replace(/[^A-Za-z\s]/g, '')" onkeypress="return (event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122) || event.charCode === 32">
                        @error('first_name')
                                <div class="text-danger">{{ $message }}</div>
                            @enderror
                    </div>
                    <div class="input-wrapper col-md-6">
                        <label for="phone">Phone Number <span class="text-danger">*</span></label>
                        <div style="display: flex; gap: 10px;">
                            <input name="phone" type="tel" id="phone" value="{{ old('phone') }}" placeholder="Phone Number" style="flex: 1;" required maxlength="10" pattern="[0-9]{10}" oninput="this.value = this.value.replace(/[^0-9]/g, '')" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                            <button type="button" class="send-otp-btn" id="send-otp-btn">
                                <span class="btn-text">Send OTP</span>
                            </button>
                        </div>
                        <div class="text-danger" id="otp-phone-error" style="display: none;"></div>
                        @error('phone')
                                <div class="text-danger">{{ $message }}</div>
                            @enderror
                    </div>
                    <div class="input-wrapper">
                        <label for="email">Email <span class="text-danger">*</span></label>
                        <input name="email" type="email" id="email" value="{{ old('email') }}" placeholder="Email" required>
                        @error('email')
                                <div class="text-danger">{{ $message }}</div>
                            @enderror
                    </div>
                    <div class="mb-3 col-md-6">
                        <label class="form-label">State <span class="text-danger">*</span></label>
                        <select id="state" name="state" class="form-select" required>
                            <option value="">Select State</option>
                            @foreach ($states as $state)
                                <option value="{{ $state->id }}">{{ $state->name }}</option>
                            @endforeach
                        </select>
                        @error('state')
                                <div class="text-danger">{{ $message }}</div>
                            @enderror
                    </div>
                    <div class="mb-3 col-md-6">
                        <label class="form-label">City <span class="text-danger">*</span></label>
                        <select id="city" name="city" class="form-select" required>
                            <option value="">Select City</option>
                        </select>
                        @error('city')
                                <div class="text-danger">{{ $message }}</div>
                            @enderror
                    </div>

                    <!-- Password fields - COMMENTED OUT
                    <div class="input-wrapper col-md-6">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="**********">
                        <span class="icon show-pass"><i class="fi fi-rr-eye"></i></span>
                        @error('password') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>

                    <div class="input-wrapper col-md-6">
                        <label for="password_confirmation">Confirm Password</label>
                        <input type="password" id="password_confirmation" name="password_confirmation" placeholder="**********">
                        <span class="icon show-pass"><i class="fi fi-rr-eye"></i></span>
                    </div> -->
{{-- URL ko pakad kar rakhne ke liye Hidden Input --}}
<input type="hidden" name="redirect_url" value="{{ request('redirect_url') }}">
                    <!-- OTP Verification Section -->
                    <div class="input-wrapper" id="otp-input-section" style="display: none;">
                        <label>Enter OTP <span class="text-success">✓ Verification Required</span></label>
                        <div class="otp-input-group">
                            <input type="text" class="otp-input" maxlength="1" data-index="0">
                            <input type="text" class="otp-input" maxlength="1" data-index="1">
                            <input type="text" class="otp-input" maxlength="1" data-index="2">
                            <input type="text" class="otp-input" maxlength="1" data-index="3">
                        </div>
                        <div class="text-danger" id="otp-error" style="display: none;"></div>
                        <div class="resend-otp" id="resend-section" style="display: none;">
                            <span>Didn't receive OTP? </span>
                            <a href="#" id="resend-otp-link">Resend OTP</a>
                            <span class="countdown" id="countdown" style="display: none;"></span>
                        </div>
                    </div>

                    <div class="input-wrapper">
                        <button type="submit" class="btn btn-primary" style="background: #163d75;" id="register-btn">Register</button>
                    </div>
                </div>
                </form>
           
                <p class="text-center mt-3">Already have an account? <a href="{{ route('customer.login') }}">Login here </a>to manage your listings, track your wishlist, and connect with potential buyers.</p>

            </div>
        </div>
    </div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

<script>
    $.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
    $(document).ready(function () {
       
        $('#state').on('change', function () {
            let stateId = $(this).val();
            $('#city').html('<option value="">Select City</option>');
            if (stateId) {
                $.get('/getcities/' + stateId, function (data) {
                    console.log(data); // <--- Check output in browser console
                    $.each(data, function (key, city) {
                        $('#city').append('<option value="' + city.id + '">' + city.name + '</option>');
                    });
                });
            }
        });

        // Phone number validation - only allow numbers
        $('#phone').on('input', function() {
            // Remove any non-numeric characters
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Limit to 10 digits
            if (this.value.length > 10) {
                this.value = this.value.slice(0, 10);
            }
            
            // Clear error message if phone is valid
            if (this.value.length === 10 && /^[0-9]{10}$/.test(this.value)) {
                $('#otp-phone-error').hide();
            }
        });

        // First name validation - only allow alphabets and spaces
        $('#name').on('input', function() {
            // Remove any non-alphabetic characters (keep only letters and spaces)
            this.value = this.value.replace(/[^A-Za-z\s]/g, '');
            
            // Remove multiple consecutive spaces
            this.value = this.value.replace(/\s+/g, ' ');
            
            // Trim leading and trailing spaces
            this.value = this.value.trim();
            
            // Clear error message if name is valid
            if (this.value.length > 0 && /^[A-Za-z\s]+$/.test(this.value)) {
                $(this).siblings('.text-danger').not('[id^="otp"]').remove();
            }
        });

        // Prevent non-alphabetic key presses for first name
        $('#name').on('keypress', function(e) {
            // Allow: backspace, delete, tab, escape, enter, letters, and space
            if ([8, 9, 27, 13, 46, 32].indexOf(e.keyCode) !== -1 ||
                (e.keyCode >= 65 && e.keyCode <= 90) || // A-Z
                (e.keyCode >= 97 && e.keyCode <= 122)) { // a-z
                return;
            }
            e.preventDefault();
        });

        // Prevent paste of non-alphabetic content in first name
        $('#name').on('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.originalEvent || e).clipboardData.getData('text/plain');
            const alphabeticOnly = pastedText.replace(/[^A-Za-z\s]/g, '');
            this.value = alphabeticOnly;
        });

        // Prevent non-numeric key presses for phone
        $('#phone').on('keypress', function(e) {
            // Allow: backspace, delete, tab, escape, enter, and numbers
            if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                (e.keyCode >= 48 && e.keyCode <= 57)) {
                return;
            }
            e.preventDefault();
        });

        // Prevent paste of non-numeric content in phone
        $('#phone').on('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.originalEvent || e).clipboardData.getData('text/plain');
            const numericOnly = pastedText.replace(/[^0-9]/g, '');
            if (numericOnly.length <= 10) {
                this.value = numericOnly;
            }
        });

        // Send OTP functionality
        $('#send-otp-btn').on('click', function() {
            const phone = $('#phone').val().trim();
            const btn = $(this);
            const btnText = btn.find('.btn-text');
            
            // Validate phone number format
            if (!phone) {
                $('#otp-phone-error').text('Phone number is required').show();
                return;
            }
            
            if (!/^[0-9]{10}$/.test(phone)) {
                $('#otp-phone-error').text('Please enter a valid 10-digit phone number (numbers only)').show();
                return;
            }

            // Show loading
            btn.prop('disabled', true);
            btnText.html('<span class="loading"></span>Sending...');

            $.ajax({
                url: '{{ route("customer.send.otp.registration") }}',
                method: 'POST',
                data: {
                    phone: phone,
                    _token: '{{ csrf_token() }}'
                },
                success: function(response) {
                    if (response.success) {
                        $('#otp-phone-error').hide();
                        $('#otp-input-section').show();
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

        // Form submission with OTP verification
        $('#registration-form').on('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            $('.text-danger').hide();
            $('.alert').remove();
            
             // Check if OTP was sent first
            if (!$('#otp-input-section').is(':visible')) {
                showAlert('error', 'OTP verification is required. Please send OTP first by clicking the "Send OTP" button.');
                $('#send-otp-btn').focus();
                return;
            }
            
            // Client-side validation
            let isValid = true;
            const requiredFields = ['first_name', 'phone', 'email', 'state', 'city'];
            
            requiredFields.forEach(function(field) {
                const fieldElement = $(`[name="${field}"]`);
                const value = fieldElement.val().trim();
                
                // Remove existing error
                fieldElement.siblings('.text-danger').not('[id^="otp"]').remove();
                
                if (!value) {
                    isValid = false;
                    const fieldName = field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const errorHtml = `<div class="text-danger">${fieldName} is required</div>`;
                    fieldElement.after(errorHtml);
                } else if (field === 'first_name') {
                    // Validate first name contains only alphabets and spaces
                    if (!/^[A-Za-z\s]+$/.test(value)) {
                        isValid = false;
                        const errorHtml = `<div class="text-danger">First Name can only contain letters and spaces</div>`;
                        fieldElement.after(errorHtml);
                    }
                } else if (field === 'phone') {
                    // Validate phone number format
                    if (!/^[0-9]{10}$/.test(value)) {
                        isValid = false;
                        const errorHtml = `<div class="text-danger">Please enter a valid 10-digit phone number</div>`;
                        fieldElement.after(errorHtml);
                    }
                }
            });
            
            if (!isValid) {
                return;
            }
            
            const otp = getOTPValue();
            if (otp.length !== 4) {
                $('#otp-error').text('Please enter the complete 4-digit OTP').show();
                return;
            }

            // Add OTP to form data
            const formData = new FormData(this);
            formData.append('otp', otp);

            const redirectUrl = $('input[name="redirect_url"]').val();
            if(redirectUrl) {
                formData.append('redirect_url', redirectUrl);
            }
            
            // Show loading
            const submitBtn = $('#register-btn');
            const originalText = submitBtn.text();
            submitBtn.prop('disabled', true).text('Registering...');

            $.ajax({
                url: $(this).attr('action'),
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.success) {
                        showAlert('success', response.message);
                        if (response.redirect) {
                            setTimeout(() => {
                                window.location.href = response.redirect;
                            }, 1000);
                        }
                    } else {
                        showAlert('error', response.message);
                    }
                },
                error: function(xhr) {
                    const response = xhr.responseJSON;
                    
                    if (response && response.errors) {
                        // Display field-specific errors
                        $.each(response.errors, function(field, messages) {
                            const fieldElement = $(`[name="${field}"]`);
                            if (fieldElement.length) {
                                // Remove existing error
                                fieldElement.siblings('.text-danger').remove();
                                
                                // Add new error
                                const errorHtml = `<div class="text-danger">${messages[0]}</div>`;
                                fieldElement.after(errorHtml);
                            }
                        });
                        
                        // Show general error message
                        if (response.message) {
                            showAlert('error', response.message);
                        }
                    } else {
                        // Fallback for non-validation errors
                        const message = response ? response.message : 'Registration failed. Please try again.';
                        showAlert('error', message);
                    }
                },
                complete: function() {
                    submitBtn.prop('disabled', false).text(originalText);
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
    });
</script>
@endsection