import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disabled, setDisabled] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.replace('Home');
            }
        });
        return unsubscribe;
    }, []);

    const disableLogin = () => {
        setDisabled(true);
        Alert.alert(
            'Too many attempts. Please wait a minute before trying again.'
        );
        setTimeout(() => {
            setDisabled(false);
        }, 60 * 1000);
    };

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(`${userCredential.user.email} is signed in.`);
            })
            .catch((error) => {
                if (error.code === 'auth/wrong-password') {
                    Alert.alert('Bad Password', 'Incorrect password.');
                } else if (error.code === 'auth/user-not-found') {
                    Alert.alert('User Not Found', 'Email could not be found.');
                } else if (error.code === 'auth/invalid-email') {
                    Alert.alert('Invalid Email', 'Please enter a valid email.');
                } else if (error.code === 'auth/internal-error') {
                    Alert.alert(
                        'Error',
                        'Something went wrong. Please try again.'
                    );
                } else if (error.code === 'auth/too-many-requests') {
                    disableLogin();
                } else {
                    Alert.alert(error.code);
                }
            });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    source={require('../../assets/bdalogo.png')}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Email'
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input}
                    autoCapitalize='none'
                />
                <TextInput
                    placeholder='Password'
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.input}
                    autoCapitalize='none'
                    secureTextEntry
                />
                <TouchableOpacity
                    onPress={handleSignIn}
                    style={disabled ? styles.buttonDisabled : styles.button}
                    disabled={disabled ? true : false}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
    },
    logoContainer: {
        marginBottom: 40,
    },
    logo: {
        width: 170,
        height: 175,
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 15,
        marginTop: 10,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#0c4484',
        width: '100%',
        marginTop: 30,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: 'gray',
        width: '100%',
        marginTop: 30,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
    },
    hyperlink: {
        color: '#0c4484',
        fontWeight: '700',
    },
});
