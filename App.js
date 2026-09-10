import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';

export default function App() {

  const [pokemon, setPokemon] = useState(null);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function buscarPokemon() {

    // Não deixa pesquisar vazio
    if (busca.trim() === '') {
      Alert.alert('Erro!', 'Informe o nome ou ID do Pokemon.');
      return;
    }

    setCarregando(true);
    setPokemon(null);

    try {

      const resposta = await fetch(
        'https://pokeapi.co/api/v2/pokemon/' + busca.toLowerCase()
      );

      // Pokemon não encontrado
      if (!resposta.ok) {
        Alert.alert('Erro!', 'Pokemon não encontrado!');
        return;
      }

      const dados = await resposta.json();

      setPokemon(dados);

    } catch (erro) {

      Alert.alert('Erro!', 'Não foi possível buscar o Pokemon.');

    } finally {

      setCarregando(false);

    }
  }

  function pegarStat(nome) {

    const stat = pokemon.stats.find(
      item => item.stat.name === nome
    );

    return stat ? stat.base_stat : '-';
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>PokeDex</Text>

      <TextInput
        style={styles.input}
        placeholder="Informe o nome ou id"
        value={busca}
        onChangeText={setBusca}
      />

      <TouchableOpacity
        style={[
          styles.botao,
          carregando && styles.botaoDesativado
        ]}
        onPress={buscarPokemon}
        disabled={carregando}
      >
        <Text style={styles.textoBotao}>
          {carregando ? 'Buscando...' : 'Buscar'}
        </Text>
      </TouchableOpacity>


      {pokemon && (

        <View style={styles.resultado}>

          <Image
            source={{
              uri: pokemon.sprites.front_default
            }}
            style={styles.imagem}
          />

          <Text style={styles.info}>
            Nome: {pokemon.name}
          </Text>

          <Text style={styles.info}>
            Tipo: {pokemon.types.map(item => item.type.name).join(', ')}
          </Text>

          <Text style={styles.info}>
            HP: {pegarStat('hp')}
          </Text>

          <Text style={styles.info}>
            Ataque: {pegarStat('attack')}
          </Text>

          <Text style={styles.info}>
            Defesa: {pegarStat('defense')}
          </Text>

          <Text style={styles.info}>
            Velocidade: {pegarStat('speed')}
          </Text>

          <Text style={styles.info}>
            Ataque Especial: {pegarStat('special-attack')}
          </Text>

          <Text style={styles.info}>
            Defesa Especial: {pegarStat('special-defense')}
          </Text>

        </View>

      )}

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 30,
    paddingTop: 70,
    backgroundColor: '#ffffff',
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },

  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 6,
    paddingHorizontal: 15,
    marginBottom: 12,
  },

  botao: {
    backgroundColor: '#6200ee',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },

  botaoDesativado: {
    backgroundColor: '#b0bec5',
  },

  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  resultado: {
    marginTop: 25,
    alignItems: 'center',
  },

  imagem: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },

  info: {
    width: '100%',
    fontSize: 15,
    marginTop: 8,
  },

});
