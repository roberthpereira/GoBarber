import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  // Criação de usuario
  async store(req, res) {
    // yup.object() pois o req.body é um object
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // validando o req.body
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  // Alteração de dados cadastrais
  async update(req, res) {
    // yup.object() pois o req.body é um object
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string(),
      password: Yup.string()
        .min(6)
        // when: Caso algum campo anterior for preenchido
        .when(
          'oldPassword',
          (oldPassword, field) => (oldPassword ? field.required() : field) // field: password
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        // oneOf: um tipo de valor, com referencia ao "password"
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // validando o req.body
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
