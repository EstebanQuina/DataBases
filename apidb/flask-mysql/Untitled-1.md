
curl --header "Content-Type: application/json" --request POST --data "{\"name\":\"Product3\"}" -v http://localhost:7002/product


curl --header "Content-Type: application/json" --request PUT --data "{"name":"Updated Product 2"}" -v http://localhost:7002/product/3

curl --header "Content_Type: application/json" --request POST --data"{\"name\":\"Author A\"&\"specialisation\":\"Python\"}" -v http://localhost:5000/author

curl --request PUT \ --header "Content-Type: application/json" \ --data "{\"name\": \"Author C Updated\", \"specialisation\": \"Rust\"}" \ -v http://127.0.0.1:5000/author/2

curl --header "Content-Type:application/json" --request PUT --data "{\"name\": \"Author P\", \"specialisation\":\"P++\"}" -v http://127.0.0.1:5000/author/1