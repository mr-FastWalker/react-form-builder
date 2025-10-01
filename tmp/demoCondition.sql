-- Is your business regulated?
UPDATE form_template_field SET condition = '{"conditions":[{"order":100,"logicalOperator":"AND","dependsOnTemplateField":"caad9a67-bfb2-4016-a08d-c5a27d1c7222","compareOperator":"equal","value":"true"}],"actions":[{"visible":true}]}'
where id in ('1e92cd72-2d2d-4639-a2e0-0963746eb5fb');
