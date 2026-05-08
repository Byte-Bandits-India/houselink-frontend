
<script>
document.addEventListener('DOMContentLoaded', function () {
    // Step 1: Get redirect URL from query param
    let redirectParam = new URLSearchParams(window.location.search).get('redirect');
    let redirectUrl = null;

    // Step 2: Decode safely (handle single/double encoded)
    if (redirectParam) {
        try {
            redirectUrl = decodeURIComponent(redirectParam);
            if (redirectUrl.includes('%2F')) {
                redirectUrl = decodeURIComponent(redirectUrl);
            }
        } catch (e) {
            redirectUrl = redirectParam;
        }
    }

    // Step 3: Apply same redirect to both auto & manual button
    const goBackLink = document.getElementById('go-back-link');
    if (redirectUrl && goBackLink) {
        goBackLink.setAttribute('href', redirectUrl);

        // ✅ Auto redirect after 2 seconds
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 2000);
    }
});
</script>
@extends('website.layouts.app')

@section('head')
<div class="page-headers parallaxie">
    <center><h1>Thank You For Your Submission</h1></center>
</div>
@endsection

@section('styles')
<style>
    .thankyou-box {
        max-width: 680px;
        margin: 30px auto;
    }
</style>
@endsection

@section('content')
<div class="container thankyou-box">
    <div class="alert alert-success" role="alert">
        ✅ Enquiry submitted successfully!<br>
        @if(request('owner_name'))
            <strong>Property Owner:</strong> {{ request('owner_name') }}<br>
        @endif
        @if(request('owner_phone'))
            <strong>Phone:</strong> <a href="tel:+91{{ request('owner_phone') }}">+91 {{ request('owner_phone') }}</a><br>
        @endif
        @if(request('property_name'))
            <strong>Property:</strong> {{ request('property_name') }}<br>
        @endif
        <hr>
        <small class="text-muted">Redirecting in 2 seconds...</small>
    </div>

    <div class="text-center">
        <a href="{{ request('redirect') ?? url('/') }}" id="go-back-link" class="btn btn-primary">Go back now</a>
    </div>
</div>
@endsection

@push('scripts')

@endpush
