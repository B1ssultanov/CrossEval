<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Error</title>
        <style>
            p, a{
                display: block;
                text-align: center;
                align-content: center;
                align-self: center;
            }
        </style>
    </head>
    <body>
        <p style="font-size: 100px; font-weight: bold">
            Error 404
        </p>
        <p style="font-size: 20px; font-weight: bold">
            contact Yedyge for more information
        </p>
        <a href="{{$fromUrl ?? '/'}}">Go to the previous page</a>
    </body>
</html>
