<div class="container">
    <div class="row">
        <div class="col-md-10">
            <h2>Package Details</h2>
        </div>
    </div>
</div>

<div class="container">
    <div class="row">
        <div class="col-md-10">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Package Name: {{ $package->name }}</h5>
                    <p class="card-text">Description: {{ $package->description }}</p>
                    <p class="card-text">User Type: {{ $package->user_type }}</p>
                    <p class="card-text">Price: {{ $package->price }}</p>
                    <p class="card-text">Percent Save: {{ $package->percent_save }}</p>
                    <p class="card-text">Month Limits: {{ $package->total_month_limit }} month</p>
                    <p class="card-text">Credits Points: {{ $package->no_of_credit }}</p>
                    <p class="card-text">Expire On: {{ \Carbon\Carbon::parse($package->expire_on)->format('d-m-Y') }}</p>
                </div>
            </div>  
        </div>
    </div>
    
            