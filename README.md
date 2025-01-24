## Documentação das Entidades

### **Entidade Product**
A entidade **Product** representa os produtos disponíveis para compra na loja.

#### Campos:
- **id** *(number)*: Identificador único do produto.
- **name** *(string)*: Nome do produto.
- **price** *(decimal)*: Preço unitário do produto. Este campo usa precisão de 10 dígitos com 2 casas decimais.
- **stock** *(number)*: Quantidade do produto disponível em estoque.
- **carts** *(Cart[])*: Relacionamento com a entidade `Cart`, indicando os carrinhos onde o produto foi adicionado.

---

### **Entidade Cart**
A entidade **Cart** representa o carrinho de compras de um usuário, contendo os produtos adicionados antes da finalização da compra.

#### Campos:
- **id** *(number)*: Identificador único do carrinho.
- **products** *(Product[])*: Lista de produtos adicionados ao carrinho. Este é um relacionamento muitos-para-muitos com a entidade `Product`.
- **order** *(Order)*: Relacionamento um-para-um com a entidade `Order`, que representa o pedido gerado a partir deste carrinho.

---

### **Entidade Order**
A entidade **Order** representa a finalização de uma compra, com detalhes como valor total e data.

#### Campos:
- **id** *(number)*: Identificador único do pedido.
- **total** *(decimal)*: Valor total do pedido, calculado com base nos produtos do carrinho. Este campo usa precisão de 10 dígitos com 2 casas decimais.
- **createdAt** *(Date)*: Data e hora em que o pedido foi criado.
- **cart** *(Cart)*: Relacionamento um-para-um com a entidade `Cart`, indicando o carrinho utilizado para gerar este pedido.

---

### **Relacionamentos Entre Entidades**

#### **Product e Cart**
- Relacionamento: **Muitos-para-Muitos**
- Um produto pode estar presente em diversos carrinhos de compras.
- Um carrinho pode conter vários produtos diferentes.

#### **Cart e Order**
- Relacionamento: **Um-para-Um**
- Um carrinho está associado a um único pedido quando a compra é finalizada.
- Um pedido é criado a partir de um único carrinho.

---

### Regras de Negócio Relacionadas

#### **Product**:
- O estoque deve ser verificado antes de adicionar um produto ao carrinho.
- O estoque é reduzido apenas ao finalizar a compra (criar um `Order`).

#### **Cart**:
- Produtos podem ser adicionados ou removidos do carrinho antes da finalização.
- O carrinho é descartado após a finalização do pedido, sendo associado a um `Order`.

#### **Order**:
- O total do pedido é calculado com base no preço e quantidade dos produtos presentes no carrinho.
- A data do pedido (é registrada automaticamente no momento da criação.

Essa documentação serve como referência para o entendimento das entidades e seus respectivos campos dentro da aplicação.

